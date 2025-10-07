import express from "express";
import { CloudAdapter, ConfigurationServiceClientCredentialFactory,
         createBotFrameworkAuthenticationFromConfiguration } from "botbuilder";
import { PolicyBot } from "./policyBot.js";

const app = express();
app.use(express.json());

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: process.env.BOT_APP_ID || "",
  MicrosoftAppPassword: process.env.BOT_APP_PASSWORD || "",
  MicrosoftAppType: "MultiTenant"
});
const auth = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);
const adapter = new CloudAdapter(auth);

adapter.onTurnError = async (ctx, err) => {
  console.error(err);
  await ctx.sendActivity("Sorry, I hit a snag. Try again.");
};

const bot = new PolicyBot();
app.post("/api/messages", async (req, res) => adapter.process(req, res, async (ctx)=> bot.run(ctx)));

app.listen(process.env.PORT || 3978, () => console.log("Bot up"));
