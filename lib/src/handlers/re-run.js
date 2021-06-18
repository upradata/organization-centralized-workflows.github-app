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
exports.handleReRun = void 0;
const models_1 = require("../models");
const handleReRun = (_appConfig) => (context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_b = (_a = context === null || context === void 0 ? void 0 : context.payload) === null || _a === void 0 ? void 0 : _a.check_run) === null || _b === void 0 ? void 0 : _b.id))
        return;
<<<<<<< HEAD
    const run = yield models_1.MongoRun.findOne({ 'checks.checksRunId': { $in: context.payload.check_run.id } });
    if (!run)
        return;
    const check = run.checks.find(check => check.checksRunId === context.payload.check_run.id);
=======
    const run = yield models_1.MongoRun.findOne({ 'checks.checks_run_id': { $in: context.payload.check_run.id } });
    if (!run)
        return;
    const check = run.checks.find(check => check.checks_run_id === context.payload.check_run.id);
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
    if (!check)
        return;
    yield context.octokit.actions.reRunWorkflow({
        owner: run.repository.owner,
<<<<<<< HEAD
        repo: run.config.workflowsRepository,
        run_id: check.runId || 0
=======
        repo: run.config.workflows_repository,
        run_id: check.run_id || 0
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
    });
});
exports.handleReRun = handleReRun;
//# sourceMappingURL=re-run.js.map