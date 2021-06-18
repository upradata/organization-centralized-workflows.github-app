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
exports.handleCompletedRun = void 0;
const models_1 = require("../models");
const handleCompletedRun = (_appConfig) => (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
<<<<<<< HEAD
    if (!context.payload.workflowRun.id)
        return;
    const run = yield models_1.MongoRun.findOne({ 'checks.runId': { $in: context.payload.workflowRun.id } });
    if (!run)
        return;
    if (context.payload.repository.name !== run.config.workflowsRepository)
        return;
    const check = run.checks.find(check => check.runId === context.payload.workflowRun.id);
=======
    if (!context.payload.workflow_run.id)
        return;
    const run = yield models_1.MongoRun.findOne({ 'checks.run_id': { $in: context.payload.workflow_run.id } });
    if (!run)
        return;
    if (context.payload.repository.name !== run.config.workflows_repository)
        return;
    const check = run.checks.find(check => check.run_id === context.payload.workflow_run.id);
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
    if (!check)
        return;
    const data = {
        owner: run.repository.owner,
        repo: run.repository.name,
<<<<<<< HEAD
        check_runId: check.checksRunId,
=======
        check_run_id: check.checks_run_id,
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
        name: `${check.name}`,
        status: (_a = context.payload.workflow_run) === null || _a === void 0 ? void 0 : _a.status,
        conclusion: (_b = context.payload.workflow_run) === null || _b === void 0 ? void 0 : _b.conclusion
    };
    yield context.octokit.checks.update(data);
});
exports.handleCompletedRun = handleCompletedRun;
//# sourceMappingURL=completed-run.js.map