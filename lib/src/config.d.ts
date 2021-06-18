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
    organizationRepository: string;
    includeOrgnaizationRepository: boolean;
    exclude: {
        repositories: string[];
    };
    constructor(appConfig: AppConfig);
}
