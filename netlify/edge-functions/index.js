// @ts-check

import { App } from 'https://esm.sh/@octokit/app@13.1.8';

const requiredEnvironmentVariables = ['GITHUB_APP_ID', 'GITHUB_APP_PRIVATE_KEY'];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (name) => !Deno.env.get(name),
);

if (missingEnvironmentVariables.length) {
  throw new Error(`Missing environment variables: ${missingEnvironmentVariables.join(', ')}`);
}

const app = new App({
  appId: Number(Deno.env.get('GITHUB_APP_ID')),
  privateKey: Deno.env.get('GITHUB_APP_PRIVATE_KEY'),
});

export const config = {
  path: '/',
};

/**
 * @param {Request} request
 */
export default async (request) => {
  const { data } = await app.octokit.request('GET /app');

  return new Response(
    `
  <h1>GitHub App: ${data.name}</h1>

  <p>Installation count: ${data.installations_count}</p>

  <p>
      <a href="https://github.com/apps/${data.slug}">
          <img src="https://img.shields.io/static/v1?label=Install%20App:&message=${data.slug}&color=orange&logo=github&style=for-the-badge" alt="Install ${data.name}"/>
      </a>
  </p>

  <p>
      <a href="https://github.com/open-sauced/catsup/#readme">source code</a>
  </p>
  `,
    {
      headers: { 'content-type': 'text/html' },
    },
  );
};
