import { SlashCommandBuilder, MessageFlags } from "discord.js";
import type { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setNameLocalizations({
      "zh-TW": "延遲",
    })
    .setDescription("查看機器人延遲"),

  async execute(interaction: CommandInteraction) {
    const startTime = Date.now();
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });
    const endTime = Date.now();
    const latency = endTime - startTime;
    await interaction.editReply({
      content: `# \`${latency}\` ms`,
    });
  },
};
