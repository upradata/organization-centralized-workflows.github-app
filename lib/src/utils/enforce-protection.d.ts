import { Context } from 'probot';
export interface EnforceProtectionOptions {
    octokit: Context['octokit'];
    repository: {
        owner: string;
        repo: string;
    };
    contextName: string;
    enforce: boolean;
    enforceAdmin?: boolean;
    logger: Context['log'];
}
export declare function enforceProtection(options: EnforceProtectionOptions): Promise<boolean>;
