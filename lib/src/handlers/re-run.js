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
    const run = yield models_1.MongoRun.findOne({ 'checks.checksRunId': { $in: context.payload.check_run.id } });
    if (!run)
        return;
    const check = run.checks.find(check => check.checksRunId === context.payload.check_run.id);
    if (!check)
        return;
    yield context.octokit.actions.reRunWorkflow({
        owner: run.repository.owner,
        repo: run.config.workflowsRepository,
        run_id: check.runId || 0
    });
});
exports.handleReRun = handleReRun;
//# sourceMappingURL=re-run.js.map