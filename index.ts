import { Probot } from 'probot'; // eslint-disable-line @typescript-eslint/no-unused-vars
import { Request, Response } from 'express';
import fetch from 'node-fetch';
import { dbConnect, initDatabase } from './db-connect';
import { runOrgAction, handleRegister, handleReRun, handleCompletedRun } from './handlers';
import { AppConfig } from './config';
import appConfigJson from '../app.config.json';


export default async (app: Probot, { getRouter }: { getRouter: any; }) => {
    const appConfig = new AppConfig(appConfigJson);

    initDatabase(appConfig, app.log);

    const { dbStatus } = await dbConnect(appConfig, app.log);

    app.log.info('app started');

    const router = getRouter(appConfig.appRoute);

    // The App listens to the following events of the repositories within the organization
    app.on([ 'push'/* , 'workflow_dispatch' */ ], runOrgAction(appConfig));

    app.on('workflow_run.completed', handleCompletedRun(appConfig));
    app.on('check_run.rerequested', handleReRun(appConfig));

    if (process.env.STATS_URI) {
        getRouter().get('/probot/stats', async (_: Request, res: Response) => {
            try {
                const response = await fetch(process.env.STATS_URI as string);
                const stats = await response.json();

                res.status(200).json(stats);
            } catch (e) {
                res.status(404);
            }
        });
    }

    // runWorkflow will call the organization GitHub Action listening to the trigger the GET request
    router.get('/register', (req: Request, res: Response) => handleRegister(appConfig)(req, res, { app }));

    router.get('/health', (_: Request, res: Response) => {
        const { connection, dbState } = dbStatus();
        const status = connection === 'up' && dbState === 'connected' ? 200 : 503;

        res.status(status).json({
            ...dbStatus(),
            sha: process.env.SHA_REF || 'unknown'
        });
    });
};
