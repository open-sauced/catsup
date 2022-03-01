import { App } from '@octokit/app/dist-src';

const GOOD_FIRST_REGEX = /^good\sfirst\sissue$/i;

const setup = () => {
  const app = new App({
    appId: APP_ID,
    privateKey: APP_PK,
    oauth: {
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    },
    webhooks: {
      secret: WEBHOOK_SECRET,
    },
  });

  app.log.warn('Yay, the app was loaded!');

  return app;
};

const verifySignature = async (app, request) => app.webhooks
  .verifyAndReceive({
    id: request.headers.get('x-github-delivery'),
    name: request.headers.get('x-github-event'),
    signature: request.headers.get('x-hub-signature-256')
      .replace(/sha256=/, ''),
    payload: (await request.json()),
  });

const webhooks = async (app) => {
  app.log.info('Listening for issues.labeled webhooks');

  app.webhooks.on('issues.labeled', async (context) => {
    const { name } = context.payload.label;

    if (!GOOD_FIRST_REGEX.test(name)) return;

    // send message to discord
    const webhook = DISCORD_URL;
    const params = {
      username: 'GFI-Catsup [beta]',
      avatar_url: 'https://github.com/open-sauced/assets/blob/master/logo.png?raw=true',
      content: `New good first issue: ${context.payload.issue.html_url}`,
    };

    // send post request using fetch to webhook
    await fetch(webhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
  });
};

export {
  setup,
  verifySignature,
  webhooks,
};
