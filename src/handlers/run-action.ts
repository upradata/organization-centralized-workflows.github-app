import { Context, WebhookPayloadWithRepository } from 'probot';
import pick from 'lodash.pick';
import { MongoRun, mongoWorkflowsRepositoryKey } from '../models';
import { shouldRun } from '../utils';
import { AppConfig, DefaultUserConfig } from '../config';



export const runOrgAction = (appConfig: AppConfig) => async (context: Context<WebhookPayloadWithRepository>): Promise<void> => {

    const { repository = {} as WebhookPayloadWithRepository } = context.payload;

    // Merge default config and user config in "appConfig.userConfigPath" set in the organization GitHub Action
    const { config } = await context.octokit.config.get({
        owner: repository.owner?.login,
        repo: appConfig.organizationRepository,
        path: appConfig.userConfigPath,
        defaults: { ...new DefaultUserConfig(appConfig) }
    });

    const excludedRepositories: string[] = config.exclude.repositories;

    if (!config.include_orgnaization_repository) {
        excludedRepositories.push(config.organization_repository);
    }

    if (!shouldRun(repository.name, excludedRepositories)) {
        return;
    }

    const sha = context.payload.after as string;
    const webhook = await context.octokit.apps.getWebhookConfigForApp();

    const token = await context.octokit.apps.createInstallationAccessToken({
        installation_id: context.payload.installation?.id || 0,
        repository_ids: [ repository.id ]
    });

    const data = {
        sha,
        // the App is listening to the route /register (see index.ts)
        // Any GitHub action in the organization listening to appConfig.repositoryDispatchEvent will run
        // and callback_url will be called through the GitHub Action defined in src/../action.yml (with curl -G {callback_url} ...)
        callback_url: `${webhook.data.url}${appConfig.appRoute}/register`,
        repository: {
            owner: repository.owner.login,
            name: repository.name,
            full_name: repository.full_name
        }
    };

    const run = new MongoRun({
        ...data,
        checks: [],
        config: pick(config, [ mongoWorkflowsRepositoryKey ])
    });

    const { _id } = await run.save();

    // Dispatch the event appConfig.repositoryDispatchEvent
    // Any GitHub action in the organization listening to this event will run
    await context.octokit.repos.createDispatchEvent({
        owner: repository.owner?.login,
        repo: config.organization_repository,
        event_type: appConfig.repositoryDispatchEvent,
        client_payload: {
            id: _id?.toString(),
            token: token.data.token,
            ...data,
            event: context.payload
        }
    });
};
