import { Context } from 'probot';
import { AppConfig } from '../config';
export declare const handleCompletedRun: (_appConfig: AppConfig) => (context: Context) => Promise<void>;
