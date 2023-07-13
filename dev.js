import AppWebhookRelay from 'github-app-webhook-relay';
import { App } from '@octokit/app';

import githubApp from './github-app.js';

run(process.env);

async function run(env) {
  const app = new App({
    appId: Number(env.GITHUB_APP_ID),
    privateKey: env.GITHUB_APP_PRIVATE_KEY,
    webhooks: {
      secret: env.GITHUB_APP_WEBHOOK_SECRET,
    },
    oauth: {
      clientId: env.GITHUB_APP_CLIENT_ID,
      clientSecret: env.GITHUB_APP_CLIENT_SECRET,
    },
    log: console,
  });

  const { data: appInfo } = await app.octokit.request('GET /app');

  app.log.info(`Authenticated as ${appInfo.html_url}`);
  app.log.info(`events: ${JSON.stringify(appInfo.events)}`);

  // get installation access token for test repository
  const [owner, repo] = env.TEST_REPOSITORY.split('/');

  await githubApp(env, app);

  const repositoryRelay = new AppWebhookRelay({
    owner,
    repo,
    createHookToken: env.TEST_REPOSITORY_CREATE_HOOK_TOKEN,
    app,
    events: appInfo.events,
  });

  repositoryRelay.on('error', (error) => {
    app.log.error('error: %s', error);
  });

  await repositoryRelay.start();

  app.log.info('Started local webhook relay server');
}
