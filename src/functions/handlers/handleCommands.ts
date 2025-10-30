import path from "path";
import { Client, Collection, REST, Routes } from "discord.js";
import type { SlashCommandBuilder } from "discord.js";
import { getAllFiles } from "@/functions/utils/fileLoader";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, any>;
  }
}

export async function handleCommands(client: Client) {
  const commandsPath = path.join("./src/commands");
  const commandFiles = getAllFiles(commandsPath);
  const commands: SlashCommandBuilder[] = [];

  client.commands = new Collection<string, any>();

  for (const file of commandFiles) {
    const command = await import(file);
    if (!command.default?.data || !command.default?.execute) continue;

    client.commands.set(command.default.data.name, command.default);
    commands.push(command.default.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);
  try {
    console.log("[事件] 開始註冊指令");
    await rest.put(
      Routes.applicationCommands(process.env.BOT_ID!),
      { body: commands }
    );
    console.log("[成功] 指令註冊完成，共註冊了", commands.length, "個指令");
  } catch (error) {
    console.error("[錯誤] 指令註冊錯誤：", error);
  }
}
