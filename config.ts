export class AppConfig {
    mongoUri: string = process.env.DB_HOST ?? 'mongodb://localhost:27017777';
    githubHost: string = process.env.GITHUB_HOST ?? 'https://github.com';
    organizationRepository: string = process.env.DEFAULT_ORGANIZATION_REPOSITORY ?? '.github';
    appRoute: string = process.env.APP_ROUTE ?? '/org-workflows';
    repositoryDispatchEvent = 'upradata/org-workflow';
    userConfigPath: string = 'org-centralized-workflows.settings.yml';

    constructor(config: Partial<AppConfig>) {
      console.log(config)
        Object.assign(this, config);
      console.log(this)
    }
}




export class DefaultUserConfig {
    organization_repository: string;
    include_orgnaization_repository: boolean = false;
    exclude = {
        repositories: [] as string[]
    };

    constructor(appConfig: AppConfig) {
        this.organization_repository = appConfig.organizationRepository;
    }
}
