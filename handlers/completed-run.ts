import { Context } from 'probot';
import { MongoRun } from '../models';
import { AppConfig } from '../config';

export const handleCompletedRun = (_appConfig: AppConfig) => async (context: Context): Promise<void> => {
    if (!context.payload.workflow_run.id)
        return;

    const run = await MongoRun.findOne({ 'checks.run_id': { $in: context.payload.workflow_run.id } });

    if (!run)
        return;

    if (context.payload.repository.name !== run.config.workflows_repository)
        return;

    const check = run.checks.find(check => check.run_id === context.payload.workflow_run.id);

    if (!check)
        return;

    const data = {
        owner: run.repository.owner,
        repo: run.repository.name,
        check_run_id: check.checks_run_id,
        name: `${check.name}`,
        status: context.payload.workflow_run?.status,
        conclusion: context.payload.workflow_run?.conclusion
    };

    await context.octokit.checks.update(data);
};
