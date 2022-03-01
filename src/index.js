import { setup, webhooks, verifySignature } from './octokit';

const application = setup();
await webhooks(application);

const dashboard = async (app) => {
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
};

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  // display installation dashboard
  if (request.method === 'GET') {
    return dashboard(application);
  }

  // else verify webhook signature
  try {
    await verifySignature(application, request);

    return new Response('{ "ok": true }', {
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    application.log.error(error);

    return new Response(`{ "error": "${error.message}" }`, {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
