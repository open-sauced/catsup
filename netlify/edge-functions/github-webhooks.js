// @ts-check

import { App } from 'https://esm.sh/@octokit/app@13.1.8';

const GOOD_FIRST_REGEX = /^good\sfirst\sissue$/i;

const requiredEnvironmentVariables = [
  'GITHUB_APP_ID',
  'GITHUB_APP_PRIVATE_KEY',
  'GITHUB_APP_CLIENT_ID',
  'GITHUB_APP_CLIENT_SECRET',
  'GITHUB_APP_WEBHOOK_SECRET',
  'DISCORD_WEBHOOKS_URL',
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !Deno.env.get(name),
);

if (missingEnvironmentVariables.length) {
  throw new Error(`Missing environment variables: ${missingEnvironmentVariables.join(', ')}`);
}

const app = new App({
  appId: Number(Deno.env.get('GITHUB_APP_ID')),
  privateKey: Deno.env.get('GITHUB_APP_PRIVATE_KEY'),
  oauth: {
    clientId: Deno.env.get('GITHUB_APP_CLIENT_ID'),
    clientSecret: Deno.env.get('GITHUB_APP_CLIENT_SECRET'),
  },
  webhooks: {
    secret: Deno.env.get('GITHUB_APP_WEBHOOK_SECRET'),
  },
});

app.webhooks.on('issues.labeled', async (context) => {
  const { name } = context.payload.label;

  if (!GOOD_FIRST_REGEX.test(name)) return;

  // send message to discord
  const discordWebhookUrl = Deno.env.get('DISCORD_WEBHOOKS_URL');
  const params = {
    username: 'GFI-Catsup [beta]',
    avatar_url: 'https://github.com/open-sauced/assets/blob/master/logo.png?raw=true',
    content: `New good first issue: ${context.payload.issue.html_url}`,
  };

  // send post request using fetch to webhook
  await fetch(discordWebhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
});

export const config = {
  path: '/api/github/webhooks',
};

/**
 * @param {Request} request
 */
export default async (request) => {
  try {
    await app.webhooks.verifyAndReceive({
      id: request.headers.get('x-github-delivery'),
      name: request.headers.get('x-github-event'),
      signature: request.headers.get('x-hub-signature-256').replace(/sha256=/, ''),
      payload: await request.text(),
    });

    return new Response('{ "ok": true }', {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    app.log.error(error);

    return new Response(`{ "error": "${error.message}" }`, {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
