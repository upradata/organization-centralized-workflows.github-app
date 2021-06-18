"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoRun = exports.RunSchema = exports.mongoWorkflowsRepositoryKey = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
<<<<<<< HEAD
exports.mongoWorkflowsRepositoryKey = 'workflowsRepository';
const runExpiry = 60 * 60 * 24 * 90; // 90 days
exports.RunSchema = new mongoose_1.default.Schema({
    sha: String,
    callbackUrl: String,
    checks: [{
            runId: Number,
            name: String,
            checksRunId: Number
=======
exports.mongoWorkflowsRepositoryKey = 'workflows_repository';
const runExpiry = 60 * 60 * 24 * 90; // 90 days
exports.RunSchema = new mongoose_1.default.Schema({
    sha: String,
    callback_url: String,
    checks: [{
            run_id: Number,
            name: String,
            checks_run_id: Number
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
        }],
    repository: {
        owner: String,
        name: String,
<<<<<<< HEAD
        fullName: String
    },
    config: {
        workflowsRepository: String
    }
});
exports.RunSchema.index({ createdAt: 1, unique: true, sparse: true, }, { expireAfterSeconds: runExpiry });
=======
        full_name: String
    },
    config: {
        workflows_repository: String
    }
});
exports.RunSchema.index({
    createdAt: 1,
    unique: true,
    sparse: true,
}, {
    expireAfterSeconds: runExpiry
});
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
exports.MongoRun = mongoose_1.default.model('Run', exports.RunSchema);
//# sourceMappingURL=runs.model.js.map