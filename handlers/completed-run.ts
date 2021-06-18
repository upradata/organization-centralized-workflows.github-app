import { Context } from 'probot';
import { MongoRun } from '../models';
import { AppConfig } from '../config';

export const handleCompletedRun = (_appConfig: AppConfig) => async (context: Context): Promise<void> => {
    if (!context.payload.workflowRun.id)
        return;

    const run = await MongoRun.findOne({ 'checks.runId': { $in: context.payload.workflowRun.id } });

    if (!run)
        return;

    if (context.payload.repository.name !== run.config.workflowsRepository)
        return;

    const check = run.checks.find(check => check.runId === context.payload.workflowRun.id);

    if (!check)
        return;

    const data = {
        owner: run.repository.owner,
        repo: run.repository.name,
        check_runId: check.checksRunId,
        name: `${check.name}`,
        status: context.payload.workflow_run?.status,
        conclusion: context.payload.workflow_run?.conclusion
    };

    await context.octokit.checks.update(data);
};
