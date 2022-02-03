/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  app.on("issues.reopened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    // send message to discord
    const message = {
      content: "Thanks for opening this issue!",
      username: "Probot",
      avatar_url: "https://avatars2.githubusercontent.com/u/3300?s=460&v=4",
    };
    const channel = "general";
    const webhook = DISCORD_WEBHOOK_URL;
    const params = {
      username: "Test TestyFace",
      avatar_url: "https://res.cloudinary.com/practicaldev/image/fetch/s--aIRKIzVN--/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/330216/51029220-5eff-400f-b8a8-02660bb8c9be.png",
      content: "There is an opened issue"
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
