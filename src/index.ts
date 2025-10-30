import dotenv from "dotenv";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { handleCommands } from "@/functions/handlers/handleCommands";
import { handleEvents } from "@/functions/handlers/handleEvents";

dotenv.config();

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.MessageContent,
] }) as Client & {
  commands?: Collection<string, any>;
};

(async () => {
  await handleCommands(client);
  await handleEvents(client);
  client.login(process.env.BOT_TOKEN);
})();
