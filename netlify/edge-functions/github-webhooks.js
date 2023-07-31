// @ts-check

import { App } from "https://esm.sh/@octokit/app@14.0.0";
import githubApp from "../../github-app.js";

const requiredEnvironmentVariables = [
  "GITHUB_APP_ID",
  "GITHUB_APP_PRIVATE_KEY",
  "GITHUB_APP_CLIENT_ID",
  "GITHUB_APP_CLIENT_SECRET",
  "GITHUB_APP_WEBHOOK_SECRET",
  "DISCORD_WEBHOOKS_URL",
];

const missingEnvironmentVariables = requiredEnvironmentVariables.filter((name) => !Deno.env.get(name));

if (missingEnvironmentVariables.length) {
  throw new Error(`Missing environment variables: ${missingEnvironmentVariables.join(", ")}`);
}

const app = new App({
  appId: Number(Deno.env.get("GITHUB_APP_ID")),
  privateKey: Deno.env.get("GITHUB_APP_PRIVATE_KEY"),
  oauth: {
    clientId: Deno.env.get("GITHUB_APP_CLIENT_ID"),
    clientSecret: Deno.env.get("GITHUB_APP_CLIENT_SECRET"),
  },
  webhooks: {
    secret: Deno.env.get("GITHUB_APP_WEBHOOK_SECRET"),
  },
  log: console,
});

githubApp(Deno.env.toObject(), app);

export const config = {
  path: "/api/github/webhooks",
};

/**
 * @param {Request} request
 */
export default async (request) => {
  if (request.method !== "POST") {
    app.log.warn(`Method ${request.method} not allowed`);
    return new Response("Not found", { status: 404 });
  }

  const event = {
    id: request.headers.get("x-github-delivery"),
    name: request.headers.get("x-github-event"),
    signature: request.headers.get("x-hub-signature-256"),
    payload: await request.text(),
  };

  try {
    await app.webhooks.verifyAndReceive(event);

    return new Response('{ "ok": true }', {
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    app.log.error(error);

    return new Response(`{ "error": "${error.message}" }`, {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
