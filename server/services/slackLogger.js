const { IncomingWebhook } = require("@slack/webhook");

const slackWebhook = new IncomingWebhook(
  "https://hooks.slack.com/services/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"
);

const sendSlackLog = async (message) => {
  try {
    // await slackWebhook.send({ text: message });
  } catch (error) {
    console.error("❌ Failed to send Slack log:", error.message);
  }
};

module.exports = { sendSlackLog };
