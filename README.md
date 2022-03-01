<div align="center">
  <br>
  <img alt="Open Sauced" src="https://i.ibb.co/7jPXt0Z/logo1-92f1a87f.png" width="300px">
  <h1>🍕 Open Sauced Catsup App 🍕</h1>
  <strong>The path to your next Open Source contribution</strong>
</div>
<br>
<p align="center">
  <a href="https://github.com/open-sauced/catsup-app/actions/workflows/release.yml">
    <img src="https://github.com/open-sauced/catsup-app/actions/workflows/release.yml/badge.svg" alt="Release" style="max-width: 100%;">
  </a>
  <a href="https://github.com/open-sauced/catsup-app/actions/workflows/compliance.yml">
    <img src="https://github.com/open-sauced/catsup-app/actions/workflows/compliance.yml/badge.svg" alt="Compliance" style="max-width: 100%;">
  </a>
  <a href="https://github.com/open-sauced/catsup-app/actions/workflows/codeql-analysis.yml">
    <img src="https://github.com/open-sauced/catsup-app/actions/workflows/codeql-analysis.yml/badge.svg" alt="CodeQL" style="max-width: 100%;">
  </a>
  <img src="https://img.shields.io/github/languages/code-size/open-sauced/catsup-app" alt="GitHub code size in bytes">
  <img src="https://img.shields.io/github/commit-activity/w/open-sauced/catsup-app" alt="GitHub commit activity">
  <a href="https://github.com/open-sauced/catsup-app/issues">
    <img src="https://img.shields.io/github/issues/open-sauced/catsup-app" alt="GitHub issues">
  </a>
  <a href="https://github.com/open-sauced/catsup-app/releases">
    <img src="https://img.shields.io/github/v/release/open-sauced/catsup-app.svg?style=flat" alt="GitHub Release">
  </a>
  <a href="https://discord.gg/U2peSNf23P">
    <img src="https://img.shields.io/discord/714698561081704529.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" alt="Discord">
  </a>
  <a href="https://twitter.com/saucedopen">
    <img src="https://img.shields.io/twitter/follow/saucedopen?label=Follow&style=social" alt="Twitter">
  </a>
</p>

## 📖 Prerequisites

In order to run the project locally we need `node>=16` and `npm>=8` installed on our development machines.

## 🖥️ Local development

To install the application:

```shell
npm ci
```

Befor you can run the application we need to start the smee proxy:

```shell
npm run proxy
```

To start a local copy of the app on port `3000`:

```shell
npm start
```

The preconfigured app is of almost no use to anyone as it can only be installed by the preconfigured user and send webhooks to a dead server.

It is quite possible that some of the secrets are rendered invalid as well. THey serve as placeholders and should be replaced with values provided by your testing app.

## 📦 Deploy to production

### Cloudflare account

Set up a cloudflare account and enable workers, change `account_id` in [wrangler.toml](./wrangler.toml) to your account id.

Go to your workers dashboard and create a new worker, select any template, adjust `name` in [wrangler.toml](./wrangler.toml) if it is taken.

Select the "Settings" tab on your newly created worker and click "Variables", add the following placeholders for now:
- `APP_ID`
- `APP_PK`
- `DISCORD_URL`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `WEBHOOK_SECRET`

**Note**: At the very end of this process you will have to encrypt all the values for the publish command to work.

Copy the "Routes" URL provided by the worker for the next part.

### GitHub App

[Create a new GitHub application](https://docs.github.com/en/developers/apps/building-github-apps/creating-a-github-app) with scopes `issues:write` and `metadata:read` while also enabling tracking events.

Upon creation you should have plain-text values for `APP_ID`, `CLIENT_ID`.

Add the following secrets to your Cloudflare worker like so:

```
wrangler secret put APP_ID
```

Add the remaingin variables using the same CLI command

Click the "Generate a new client secret" button and copy the value of `CLIENT_SECRET`.

In the webhook return URL copy the value of your worker route as described in the last step of the Cloudflare setup.

It is advised you generate the `WEBHOOK_SECRET` using the following command:

```shell
# random key strokes can work too if you don't have ruby(??)
ruby -rsecurerandom -e 'puts SecureRandom.hex(20)'
```

Now, go to the very bottom and click "Generate a new private key" and open a terminal in the location of the downloaded file.

Rename this file to `private-key.pem` for the next command to work:

```shell
openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in private-key.pem -out private-key-pkcs8.key
```

Copy the contents of `private-key-pkcs8.key` to `APP_PK`. Note the
string will need to be on one line joined with `\n`.

### Discord

Go to your server of choice, click "Settings" and then "Integrations", create a new webhook and copy the URL and paste that value into `DISCORD_URL`.

Now you are good to use the wrangler release workflows and deploy to production!

### Terminal publish

Login to cloudflare with your account credentials, advised you let the browser open an OAuth dialog with:

```shell
npm run wrangler -- login
```

Now you can test all the variables are correct by publishing from the terminal:

```shell
# npm run wrangler -- publish
npm run deploy
```

Open up a production real time log using:

```shell
npm run wrangler -- tail
```

### CI publish

Create a new GitHub actions secrets named `CF_API_TOKEN`, get its value from Cloudflare's [create a new token](https://dash.cloudflare.com/profile/api-tokens) using the "Edit Cloudflare Workers" template.

Push new code to the server, after a release the new code should be sent to the server and instantly propagate.

## 🤝 Contributing

We encourage you to contribute to Open Sauced! Please check out the [Contributing guide](https://docs.opensauced.pizza/contributing/introduction-to-contributing/) for guidelines about how to proceed.

<img align="right" src="https://i.ibb.co/CJfW18H/ship.gif" width="200"/>

## 🍕 Community

Got Questions? Join the conversation in our [Discord](https://discord.gg/U2peSNf23P).  
Find Open Sauced videos and release overviews on our [YouTube Channel](https://www.youtube.com/channel/UCklWxKrTti61ZCROE1e5-MQ).

## 🎦 Repository Visualization

[![Visualization of this repository](./public/diagram.svg)
](./src)

## ⚖️ LICENSE

MIT © [Open Sauced](LICENSE)
