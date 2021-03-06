import * as core from "@actions/core";
import * as params from "./parse-params";
import * as gitCommandManager from "./third-party/checkout/git-command-manager";
import {v4 as uuid} from 'uuid';
import setupSSH from "./setup-ssh";
import gitUrlParse from "git-url-parse";
import * as github from "@actions/github";

const sshKey = params.get("ssh-key", "");
const repoUrl = params.get("repo-url");
const lfs = params.getBoolean("lfs", false);
const force = params.getBoolean("force", false);
const includeBranches = params.getArray("include-branches", ";", []);
const excludeBranches = params.getArray("exclude-branches", ";", []);

const REMOTE_BRANCH_PREFIX = "origin/";
const remote = uuid();
(async () => {
        if (sshKey == "") {
            if ((github.context.payload as any).repository.fork) {
                core.warning('This action runs on a fork and not found auth token, Skip deployment');
                return
            } else {
                throw new Error("ssh-key require!");
            }
        }

        let url = gitUrlParse(repoUrl);
        await setupSSH(sshKey, url.resource, url.port || 22);
        const git = await gitCommandManager.createCommandManager(process.cwd(), lfs);
        let localBranches = await git.branchList(false);
        core.info("local branches:" + localBranches.join(","))
        let branches = await git.branchList(true);
        core.info(branches.join(","));
        const finalPush = [];
        for (let b of branches) {
            if (!b.startsWith(REMOTE_BRANCH_PREFIX)) {
                continue;
            }
            const branch = b.substr(REMOTE_BRANCH_PREFIX.length);
            let exclude = excludeBranches.includes(branch);
            let include = includeBranches.length == 0 || includeBranches.includes(branch);
            if (include) {
                if (exclude) {
                    if (includeBranches.length == 0) {
                        continue;
                    } else {
                        core.warning(`branch ${branch} in include branches and exclude branches. it will be include`);
                    }
                }
                finalPush.push(branch);
                if (!localBranches.includes(branch)) {
                    await git.createBranch(branch, true, branch);
                }
            }
        }
        if (core.isDebug()) {
            branches = await git.branchList(false);
            core.debug(branches.join(","));
        }
        await git.remoteAdd(remote, repoUrl);
        await git.fetch(finalPush)
        await git.push(remote, force, finalPush);

})().catch(e => {
    core.setFailed(e);
})

