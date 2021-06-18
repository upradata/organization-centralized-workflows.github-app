"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoRun = exports.RunSchema = exports.mongoWorkflowsRepositoryKey = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.mongoWorkflowsRepositoryKey = 'workflowsRepository';
const runExpiry = 60 * 60 * 24 * 90; // 90 days
exports.RunSchema = new mongoose_1.default.Schema({
    sha: String,
    callbackUrl: String,
    checks: [{
            runId: Number,
            name: String,
            checksRunId: Number
        }],
    repository: {
        owner: String,
        name: String,
        fullName: String
    },
    config: {
        workflowsRepository: String
    }
});
exports.RunSchema.index({ createdAt: 1, unique: true, sparse: true, }, { expireAfterSeconds: runExpiry });
exports.MongoRun = mongoose_1.default.model('Run', exports.RunSchema);
//# sourceMappingURL=runs.model.js.map