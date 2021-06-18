import { Context } from 'probot';

export interface EnforceProtectionOptions {
    octokit: Context[ 'octokit' ];
    repository: { owner: string; repo: string; };
    contextName: string;
    enforce: boolean;
    enforceAdmin?: boolean;
    logger: Context[ 'log' ];
}

export async function enforceProtection(options: EnforceProtectionOptions): Promise<boolean> {

    const { octokit, repository, contextName, enforce, enforceAdmin = false, logger } = options;

    const repo = await octokit.repos.get({
        ...repository,
        mediaType: {
            previews: [ 'symmetra' ]
        }
    });


    const protection = await octokit.repos.getBranchProtection({
        ...repository,
        branch: repo.data.default_branch
    }).catch(e => {
        logger.error('Error while requestion the branch protection');
        logger.error(e);
        return undefined;
    });


    if (!protection)
        return false;

    const {
        required_status_checks,
        enforce_admins,
        required_pull_request_reviews,
        required_linear_history,
        allow_force_pushes,
        allow_deletions
    } = protection.data || {};


    const { contexts } = required_status_checks ?? {};
    const enforceAdminsCurrentSetting = enforce_admins?.enabled ?? false;

    const adminForceChange = enforceAdminsCurrentSetting !== enforceAdmin;
    const contextIndex = contexts?.indexOf(contextName) || -1;

    // noop actions
    if (!adminForceChange) { // Admin enforce didn't change
        if (contextIndex !== -1 && enforce)
            return false; // Context is already enforced

        if (contextIndex === -1 && !enforce)
            return false; // Context isn't enforced and shouldn't be.
    }

    if (contextIndex !== -1 && !enforce) {
        contexts!.splice(contextIndex, 1);
    } else if (contextIndex === -1 && enforce) {
        contexts!.push(contextName);
    }


    await octokit.repos.updateBranchProtection({
        ...repository,
        branch: repo.data.default_branch,
        required_status_checks: {
            strict: required_status_checks?.enforcement_level === 'strict' ?? false,
            contexts: contexts || []
        },
        enforce_admins: adminForceChange ? !enforceAdminsCurrentSetting : enforceAdminsCurrentSetting,

        required_pull_request_reviews: required_pull_request_reviews ? {
            dismiss_stale_reviews: required_pull_request_reviews?.dismiss_stale_reviews ?? false,
            require_code_owner_reviews: required_pull_request_reviews?.require_code_owner_reviews ?? 0
        } : null,

        required_linear_history: required_linear_history?.enabled,
        allow_force_pushes: allow_force_pushes?.enabled,
        allow_deletions: allow_deletions?.enabled,
        restrictions: null
    });

    return true;
}
