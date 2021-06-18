"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultUserConfig = exports.AppConfig = void 0;
class AppConfig {
    constructor(config) {
        var _a, _b, _c, _d;
        this.mongoUri = (_a = process.env.DB_HOST) !== null && _a !== void 0 ? _a : 'mongodb://localhost:27017';
        this.githubHost = (_b = process.env.GITHUB_HOST) !== null && _b !== void 0 ? _b : 'https://github.com';
        this.organizationRepository = (_c = process.env.DEFAULT_organizationRepository) !== null && _c !== void 0 ? _c : '.github';
        this.appRoute = (_d = process.env.APP_ROUTE) !== null && _d !== void 0 ? _d : '/org-workflows';
        this.repositoryDispatchEvent = 'upradata/org-workflow';
        this.userConfigPath = 'org-centralized-workflows.settings.yml';
        Object.assign(this, config);
    }
}
exports.AppConfig = AppConfig;
class DefaultUserConfig {
    constructor(appConfig) {
        this.includeOrgnaizationRepository = false;
        this.exclude = {
            repositories: []
        };
        this.organizationRepository = appConfig.organizationRepository;
    }
}
exports.DefaultUserConfig = DefaultUserConfig;
//# sourceMappingURL=config.js.map