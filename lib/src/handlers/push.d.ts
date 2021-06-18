import { Context, WebhookPayloadWithRepository } from 'probot';
import { AppConfig } from '../config';
export declare const runOrgAction: (appConfig: AppConfig) => (context: Context<WebhookPayloadWithRepository>) => Promise<void>;
