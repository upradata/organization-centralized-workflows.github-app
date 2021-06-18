import mongoose from 'mongoose';
export declare const mongoWorkflowsRepositoryKey: keyof RunDocument['config'];
export interface Check {
<<<<<<< HEAD
    runId: number;
    name?: string;
    checksRunId: number;
}
export interface RunDocument extends mongoose.Document<{
    toString: () => string;
}> {
    sha: string;
    callbackUrl: string;
=======
    run_id: number;
    name?: string;
    checks_run_id: number;
}
export interface RunDocument extends mongoose.Document {
    sha: string;
    callback_url: string;
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
    checks: Check[];
    repository: {
        owner: string;
        name: string;
<<<<<<< HEAD
        fullName: string;
    };
    config: {
        workflowsRepository: string;
    };
    expireAt?: Date;
=======
        full_name: string;
    };
    config: {
        workflows_repository: string;
    };
    expire_at?: Date;
>>>>>>> cf0fc7df2f0ea23dfc56eb8b326484b9f43a11cb
}
export declare const RunSchema: mongoose.Schema<mongoose.Document<any, any>, mongoose.Model<any, any, any>, undefined>;
export declare const MongoRun: mongoose.Model<RunDocument, {}, {}>;
