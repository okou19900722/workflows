export default interface IGitCommandManager {
    branchList(remote: boolean): Promise<string[]>
    createBranch(name: string, remote: boolean, branch: string): Promise<void>
    push(remoteName: string, force: boolean, branches?: string[]): Promise<void>;
    remoteAdd(remoteName: string, remoteUrl: string): Promise<void>
    execGit(args: string[]): Promise<any>

    branchDelete(remote: boolean, branch: string): Promise<void>
    branchExists(remote: boolean, pattern: string): Promise<boolean>
    checkout(ref: string, startPoint: string): Promise<void>
    checkoutDetach(): Promise<void>
    config(
        configKey: string,
        configValue: string,
        globalConfig?: boolean
    ): Promise<void>
    configExists(configKey: string, globalConfig?: boolean): Promise<boolean>
    fetch(refSpec: string[], fetchDepth?: number): Promise<void>
    getDefaultBranch(repositoryUrl: string): Promise<string>
    getWorkingDirectory(): string
    init(): Promise<void>
    isDetached(): Promise<boolean>
    lfsFetch(ref: string): Promise<void>
    lfsInstall(): Promise<void>
    log1(format?: string): Promise<string>
    remoteAdd(remoteName: string, remoteUrl: string): Promise<void>
    removeEnvironmentVariable(name: string): void
    revParse(ref: string): Promise<string>
    setEnvironmentVariable(name: string, value: string): void
    shaExists(sha: string): Promise<boolean>
    submoduleForeach(command: string, recursive: boolean): Promise<string>
    submoduleSync(recursive: boolean): Promise<void>
    submoduleUpdate(fetchDepth: number, recursive: boolean): Promise<void>
    tagExists(pattern: string): Promise<boolean>
    tryClean(): Promise<boolean>
    tryConfigUnset(configKey: string, globalConfig?: boolean): Promise<boolean>
    tryDisableAutomaticGarbageCollection(): Promise<boolean>
    tryGetFetchUrl(): Promise<string>
    tryReset(): Promise<boolean>
}
