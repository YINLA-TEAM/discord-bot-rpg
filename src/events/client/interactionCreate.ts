import { EmbedBuilder, MessageFlags } from "discord.js";
import type { Interaction } from "discord.js";

export default {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands?.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);

      const errorEmbed = new EmbedBuilder()
        .setTitle(
          `[錯誤] ${error instanceof Error ? error.name : "Unknown Error"}`
        )
        .setDescription(
          `\`\`\n${(error as Error).message.slice(0, 300)}\n\`\`\``
        )
        .setColor("Red")
        .setFooter({ text: "請聯繫管理員以獲取更多幫助" })
        .setTimestamp();

      await interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
