const { App } = require('@octokit/app');

const GOOD_FIRST_REGEX = /^good\sfirst\sissue$/i;

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

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  if (request.method === 'GET') {
    const { data } = await app.octokit.request('GET /app');

    return new Response(`
<h1>GitHub App: ${data.name}</h1>

<p>Installation count: ${data.installations_count}</p>

<p>
    <a href="https://github.com/apps/${data.slug}">
        <img src="https://img.shields.io/static/v1?label=Install%20App:&message=${
  data.slug
}&color=orange&logo=github&style=for-the-badge" alt="Install ${data.name}"/>
    </a>
</p>

<p>
    <a href="https://github.com/0-vortex/open-sauced-catsup-app-test/#readme">source code</a>
</p>
`, {
      headers: { 'content-type': 'text/html' },
    });
  }

  const id = request.headers.get('x-github-delivery');
  const name = request.headers.get('x-github-event');
  const payload = await request.json();

  try {
    await app.webhooks.receive({
      id,
      name,
      payload,
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
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
