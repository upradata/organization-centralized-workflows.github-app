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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleRegister = void 0;
const models_1 = require("../models");
const utils_1 = require("../utils");
const handleRegister = (appConfig) => (req, res, { app }) => __awaiter(void 0, void 0, void 0, function* () {
    // This will be called from the GitHub Action defined in src/../action.yml (with curl -G {callbackUrl} ...)
    const { id, runId, name, sha, enforce, enforceAdmin, documentation } = req.query;
    const run = yield models_1.MongoRun.findById(id);
    if (!run)
        return res.sendStatus(404);
    // Although unlikely, make sure that people can't create checks by submitting random IDs (mongoose IDs are not-so-random)
    if (run.sha !== sha)
        return res.sendStatus(404);
    const data = {
        owner: run.repository.owner,
        repo: run.repository.name,
        head_sha: run.sha,
        name,
        details_url: `${appConfig.githubHost}/${run.repository.owner}/${run.config.workflowsRepository}/actions/runs/${runId}`,
        status: 'in_progress',
        output: undefined
    };
    const getOctokit = () => __awaiter(void 0, void 0, void 0, function* () {
        const octokit = yield app.auth();
        const installation = yield octokit.apps.getOrgInstallation({ org: run.repository.owner });
        return app.auth(installation.data.id);
    });
    const octokit = yield getOctokit();
    if (documentation) {
        try {
            const docs = yield octokit.repos.getContent({
                owner: run.repository.owner,
                repo: run.config.workflowsRepository,
                path: documentation
            });
            const { content, encoding } = docs.data;
            const summary = Buffer.from(content, encoding).toString();
            data.output = { title: name, summary };
        }
        catch (e) {
            app.log.debug('Error while fetching repository documentation');
            app.log.debug(e);
        }
    }
    const checksRun = yield octokit.checks.create(data);
    utils_1.enforceProtection({
        octokit,
        repository: { owner: run.repository.owner, repo: run.repository.name },
        contextName: data.name,
        enforce: enforce === 'true',
        // Exclude the repository that contains the workflow
        enforceAdmin: run.repository.name !== run.config.workflowsRepository && enforceAdmin === 'true',
        logger: app.log
    });
    const checkInfo = {
        name: data.name,
        runId: Number(runId),
        checksRunId: checksRun.data.id
    };
    yield models_1.MongoRun.findByIdAndUpdate(id, { $push: { checks: checkInfo } });
    return res.sendStatus(200);
});
exports.handleRegister = handleRegister;
//# sourceMappingURL=register.js.map