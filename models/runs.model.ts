import mongoose from 'mongoose';

export const mongoWorkflowsRepositoryKey: keyof RunDocument[ 'config' ] = 'workflowsRepository';


const runExpiry = 60 * 60 * 24 * 90; // 90 days


export interface Check {
    runId: number; // The run in the central workflow
    name?: string; // Name of the status check
    checksRunId: number; // ID of status check on commit
}


export interface RunDocument extends mongoose.Document<{ toString: () => string; }> {
    sha: string;
    callbackUrl: string;
    checks: Check[];
    repository: {
        owner: string;
        name: string;
        fullName: string;
    };
    config: {
        workflowsRepository: string;
    };
    expireAt?: Date;
}


export const RunSchema = new mongoose.Schema({
    sha: String,
    callbackUrl: String,
    checks: [ {
        runId: Number,
        name: String,
        checksRunId: Number
    } ],
    repository: {
        owner: String,
        name: String,
        fullName: String
    },
    config: {
        workflowsRepository: String
    }
});


RunSchema.index(
    { createdAt: 1, unique: true, sparse: true, },
    { expireAfterSeconds: runExpiry }
);


export const MongoRun = mongoose.model<RunDocument>('Run', RunSchema);
