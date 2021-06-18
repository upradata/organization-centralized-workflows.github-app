export class AppConfig {
    mongoUri: string = process.env.DB_HOST ?? 'mongodb://localhost:27017';
    githubHost: string = process.env.GITHUB_HOST ?? 'https://github.com';
    organizationRepository: string = process.env.DEFAULT_organizationRepository ?? '.github';
    appRoute: string = process.env.APP_ROUTE ?? '/org-workflows';
    repositoryDispatchEvent = 'upradata/org-workflow';
    userConfigPath: string = 'org-centralized-workflows.settings.yml';

    constructor(config: Partial<AppConfig>) {
        Object.assign(this, config);
    }
}




export class DefaultUserConfig {
    organizationRepository: string;
    includeOrgnaizationRepository: boolean = false;
    exclude = {
        repositories: [] as string[]
    };

    constructor(appConfig: AppConfig) {
        this.organizationRepository = appConfig.organizationRepository;
    }
}
