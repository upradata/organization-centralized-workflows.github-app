import mongoose from 'mongoose';

export const mongoWorkflowsRepositoryKey: keyof RunDocument[ 'config' ] = 'workflows_repository';


const runExpiry = 60 * 60 * 24 * 90; // 90 days


export interface Check {
    run_id: number; // The run in the central workflow
    name?: string; // Name of the status check
    checks_run_id: number; // ID of status check on commit
}


export interface RunDocument extends mongoose.Document {
    sha: string;
    callback_url: string;
    checks: Check[];
    repository: {
        owner: string;
        name: string;
        full_name: string;
    };
    config: {
        workflows_repository: string;
    };
    expire_at?: Date;
}


export const RunSchema = new mongoose.Schema({
    sha: String,
    callback_url: String,
    checks: [ {
        run_id: Number,
        name: String,
        checks_run_id: Number
    } ],
    repository: {
        owner: String,
        name: String,
        full_name: String
    },
    config: {
        workflows_repository: String
    }
});


RunSchema.index(
    {
        createdAt: 1,
        unique: true,
        sparse: true,
    },
    {
        expireAfterSeconds: runExpiry
    }
);


export const MongoRun = mongoose.model<RunDocument>('Run', RunSchema);
