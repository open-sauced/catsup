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

To run the GitHub App code against a test repository, add `TEST_REPOSITORY` to your local `.env` file.

To start the server locally at port `8888`:

```shell
npm start
```

## 📦 Deploy to production

### Netlify account

Install the Netlify GitHub app in the repository and configure the environment variables
listed in [.env.example](.env.example).

### GitHub App

[Register a new GitHub application](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/registering-a-github-app) with the permissions `issues:write` and `metadata:read`. Set the webhook URL to `<your netlify domain>/api/github/webhooks`.

Once registered, you will be able to obtain all the `GITHUB_APP_*` credentials from the app settings.

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

Copy the contents of `private-key-pkcs8.key` to `GITHUB_APP_PRIVATE_KEY`. Note the
string will need to be on one line joined with `\n`.

### Discord

Go to your server of choice, click "Settings" and then "Integrations", create a new webhook and copy the URL and paste that value into `DISCORD_WEBHOOKS_URL`.

Now you are good to use the wrangler release workflows and deploy to production!

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
