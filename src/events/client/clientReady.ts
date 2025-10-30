import type { Client } from "discord.js";

export default {
  name: "clientReady",
  once: true,
  async execute(client: Client) {
    console.log(`[成功] 機器人 ${client.user?.tag} 已上線！`);
  }
}