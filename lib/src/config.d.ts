export declare class AppConfig {
    mongoUri: string;
    githubHost: string;
    organizationRepository: string;
    appRoute: string;
    repositoryDispatchEvent: string;
    userConfigPath: string;
    constructor(config: Partial<AppConfig>);
}
export declare class DefaultUserConfig {
<<<<<<< HEAD
    organizationRepository: string;
    includeOrgnaizationRepository: boolean;
=======
    organization_repository: string;
    include_orgnaization_repository: boolean;
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
    exclude: {
        repositories: string[];
    };
    constructor(appConfig: AppConfig);
}
