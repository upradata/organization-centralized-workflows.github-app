import { Probot } from 'probot'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Request, Response } from 'express';
import { MongoRun, Check, ActionInputs } from '../models';
import { enforceProtection } from '../utils';
import { AppConfig } from '../config';

export type RegisterRequest = Request<Record<string, string>, any, any, ActionInputs>;

export const handleRegister = (appConfig: AppConfig) => async (req: RegisterRequest, res: Response, { app }: { app: Probot; }): Promise<any> => {
    // This will be called from the GitHub Action defined in src/../action.yml (with curl -G {callbackUrl} ...)
    const { id, runId, name, sha, enforce, enforceAdmin, documentation } = req.query;

    const run = await MongoRun.findById(id);

    if (!run)
        return res.sendStatus(404);

    // Although unlikely, make sure that people can't create checks by submitting random IDs (mongoose IDs are not-so-random)
    if (run.sha !== sha)
        return res.sendStatus(404);

    const data = {
        owner: run.repository.owner,
        repo: run.repository.name,
        head_sha: run.sha,
        name,
        details_url: `${appConfig.githubHost}/${run.repository.owner}/${run.config.workflowsRepository}/actions/runs/${runId}`,
        status: 'in_progress',
        output: undefined as any as { title: string; summary: string; }
    };

    const getOctokit = async () => {
        const octokit = await app.auth();
        const installation = await octokit.apps.getOrgInstallation({ org: run.repository.owner });
        return app.auth(installation.data.id);
    };

    const octokit = await getOctokit();

    if (documentation) {
        try {
            const docs = await octokit.repos.getContent({
                owner: run.repository.owner,
                repo: run.config.workflowsRepository,
                path: documentation as string
            });

            const { content, encoding } = docs.data as any;

            const summary = Buffer.from(content, encoding).toString();
            data.output = { title: name as string, summary };

        } catch (e) {
            app.log.debug('Error while fetching repository documentation');
            app.log.debug(e);
        }
    }

    const checksRun = await octokit.checks.create(data);

    enforceProtection({
        octokit,
        repository: { owner: run.repository.owner, repo: run.repository.name },
        contextName: data.name,
        enforce: enforce === 'true',
        // Exclude the repository that contains the workflow
        enforceAdmin: run.repository.name !== run.config.workflowsRepository && enforceAdmin === 'true',
        logger: app.log
    });

    const checkInfo: Check = {
        name: data.name,
        runId: Number(runId),
        checksRunId: checksRun.data.id
    };

    await MongoRun.findByIdAndUpdate(id, { $push: { checks: checkInfo } });

    return res.sendStatus(200);
};
