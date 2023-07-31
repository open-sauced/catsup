const GOOD_FIRST_REGEX = /^good\sfirst\sissue$/i;

/**
 * @param {Record<string, string>} env
 * @param {import("@octokit/app").App} app
 */
export default async function githubApp(env, app) {
  app.log.info('App loaded');

  app.webhooks.onAny(async ({ name, payload }) => {
    const eventNameWithAction = payload.action ? `${name}.${payload.action}` : name;

    app.log.info(`Event received: ${eventNameWithAction}`);
  });

  app.webhooks.on('issues.labeled', async (context) => {
    const { name } = context.payload.label;

    if (!GOOD_FIRST_REGEX.test(name)) return;

    // send message to discord
    const discordWebhookUrl = env.DISCORD_WEBHOOKS_URL;
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
}
