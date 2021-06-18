"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOrgAction = void 0;
const lodash_pick_1 = __importDefault(require("lodash.pick"));
const models_1 = require("../models");
const utils_1 = require("../utils");
const config_1 = require("../config");
const runOrgAction = (appConfig) => (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { repository = {} } = context.payload;
    // Merge default config and user config in "appConfig.userConfigPath" set in the organization GitHub Action
    const { config } = yield context.octokit.config.get({
        owner: (_a = repository.owner) === null || _a === void 0 ? void 0 : _a.login,
        repo: appConfig.organizationRepository,
        path: appConfig.userConfigPath,
        defaults: Object.assign({}, new config_1.DefaultUserConfig(appConfig))
    });
    const excludedRepositories = config.exclude.repositories;
    if (!config.includeOrgnaizationRepository) {
        excludedRepositories.push(config.organizationRepository);
    }
    if (!utils_1.shouldRun(repository.name, excludedRepositories)) {
        return;
    }
    const sha = context.payload.after;
    const webhook = yield context.octokit.apps.getWebhookConfigForApp();
    const token = yield context.octokit.apps.createInstallationAccessToken({
        installation_id: ((_b = context.payload.installation) === null || _b === void 0 ? void 0 : _b.id) || 0,
        repository_ids: [repository.id]
    });
    const data = {
        sha,
        // the App is listening to the route /register (see index.ts)
        // Any GitHub action in the organization listening to appConfig.repositoryDispatchEvent will run
        // and callbackUrl will be called through the GitHub Action defined in src/../action.yml (with curl -G {callbackUrl} ...)
        callbackUrl: `${webhook.data.url}${appConfig.appRoute}/register`,
        repository: {
            owner: repository.owner.login,
            name: repository.name,
            fullName: repository.full_name
        }
    };
    const run = new models_1.MongoRun(Object.assign(Object.assign({}, data), { checks: [], config: lodash_pick_1.default(config, [models_1.mongoWorkflowsRepositoryKey]) }));
    const { _id } = yield run.save();
    // Dispatch the event appConfig.repositoryDispatchEvent
    // Any GitHub action in the organization listening to this event will run
    yield context.octokit.repos.createDispatchEvent({
        owner: (_c = repository.owner) === null || _c === void 0 ? void 0 : _c.login,
        repo: config.organizationRepository,
        event_type: appConfig.repositoryDispatchEvent,
        client_payload: Object.assign(Object.assign({ id: _id === null || _id === void 0 ? void 0 : _id.toString(), token: token.data.token }, data), { event: context.payload })
    });
});
exports.runOrgAction = runOrgAction;
//# sourceMappingURL=push.js.map