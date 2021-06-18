import mongoose from 'mongoose';
export declare const mongoWorkflowsRepositoryKey: keyof RunDocument['config'];
export interface Check {
    runId: number;
    name?: string;
    checksRunId: number;
}
export interface RunDocument extends mongoose.Document<{
    toString: () => string;
}> {
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
export declare const RunSchema: mongoose.Schema<mongoose.Document<any, any>, mongoose.Model<any, any, any>, undefined>;
export declare const MongoRun: mongoose.Model<RunDocument, {}, {}>;
