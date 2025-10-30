import { SlashCommandBuilder, MessageFlags } from "discord.js";
import type { CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });
    await interaction.editReply({
      content: "Pong!",
    });
  },
};
