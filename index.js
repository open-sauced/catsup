const fetch = require("node-fetch")
/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  const GOOD_FIRST_REGEX = /^good\sfirst\sissue$/i

  app.on("issues.labeled", async (context) => {
    const labels = context.payload.issue.labels

    if (!GOOD_FIRST_REGEX.test(context.payload.label.name)) return
    console.log(context.payload.issue.html_url)

    // send message to discord
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    const params = {
      username: "Good First Issue Catsup",
      avatar_url: "https://i5.walmartimages.com/asr/cd65cf5f-2e66-4749-9ec2-29e7b47adac8.520f35806c56e59af34a89428910a161.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF",
      content: "New good first issue: " + context.payload.issue.html_url
    }

    // send post request using fetch to webhook
    fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
  });



  //JSON.stringify(params)
  // send params to using DISCORD_WEBHOOK_URL


  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
