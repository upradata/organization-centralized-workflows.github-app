import { Context } from 'probot';
import mongoose from 'mongoose';
import { AppConfig } from './config';
export declare const initDatabase: (_appConfig: AppConfig, logger: Context['log']) => mongoose.Query<mongoose.UpdateWriteOpResult, import("./models").RunDocument, {}>;
interface Status {
    connection: string;
    dbState: string;
}
export declare const dbConnect: (appConfig: AppConfig, logger: Context['log']) => Promise<{
    dbStatus: () => Status;
}>;
export declare const dbStatus: () => Status;
export {};
