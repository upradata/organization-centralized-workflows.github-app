import { Context } from 'probot';
import { AppConfig } from '../config';
import { MongoRun } from '../models';

export const handleReRun = (_appConfig: AppConfig) => async (context: Context): Promise<void> => {
    if (!context?.payload?.check_run?.id) return;

    const run = await MongoRun.findOne({ 'checks.checks_run_id': { $in: context.payload.check_run.id } });

    if (!run) return;
    const check = run.checks.find(check => check.checks_run_id === context.payload.check_run.id);
    if (!check) return;

    await context.octokit.actions.reRunWorkflow({
        owner: run.repository.owner,
        repo: run.config.workflows_repository,
        run_id: check.run_id || 0
    });
};
