import type { Client } from "discord.js";

export default {
  name: "clientReady",
  once: true,
  async execute(client: Client) {
    console.log(`[成功] 機器人 ${client.user?.tag} 已上線！`);
    console.log(`[資訊] 目前正在服務 ${client.guilds.cache.size} 個伺服器`);
    console.log(`[資訊] 機器人啟動時間：${new Date().toLocaleString()}`);
  }
}