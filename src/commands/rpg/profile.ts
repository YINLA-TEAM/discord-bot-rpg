import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import { supabase } from "@db/supabaseClient";
import { classMap } from "@rpg/classes";
import type { PlayerClassStats } from "@/types/rpg";

export default {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setNameLocalizations({
      "zh-TW": "玩家資料",
    })
    .setDescription("查看你或其他玩家的 RPG 玩家資料")
    .addUserOption((option) =>
      option
        .setName("user")
        .setNameLocalizations({
          "zh-TW": "使用者",
        })
        .setDescription("你想查看的玩家資料")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const targetUser = interaction.options.getUser("user") || interaction.user;
    const userId = targetUser.id;

    const { data: player, error: fetchError } = await supabase
      .from("players")
      .select("*, player_class_stats(*)")
      .eq("userId", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.log("[錯誤]", fetchError.code, fetchError.message);
      await interaction.editReply({
        content: "# 獲取角色資料時發生錯誤，請稍後再試",
      });
      return;
    }

    if (!player && interaction.user.id === targetUser.id) {
      await interaction.editReply({
        content: `# 玩家 \`${targetUser.username}\` 尚未建立 RPG 資料，請先使用 \`/選擇職業\` 選擇職業並建立角色`,
      });
    } else if (!player && interaction.user.id !== targetUser.id) {
      await interaction.editReply({
        content: `# 玩家 \`${targetUser.username}\` 尚未建立 RPG 資料`,
      });
    } else {
      const playerClassEmbedList: EmbedBuilder[] = [];

      const stats: PlayerClassStats[] =
        player.player_class_stats as PlayerClassStats[];

      const profileEmbed = new EmbedBuilder()
        .setTitle(`玩家資料 - \`${targetUser.username}\``)
        .addFields(
          {
            name: "等級",
            value: `**\`${player.level}(${player.experience})\`**`,
            inline: true,
          },
          {
            name: "金錢",
            value: `**\`${player.money}\`**`,
            inline: true,
          },
          {
            name: "鑽石",
            value: `**\`${player.diamonds}\`**`,
            inline: true,
          }
        )
        .setColor("Blue");

      playerClassEmbedList.push(profileEmbed);

      stats.map((stat: PlayerClassStats) => {
        const statsEmbed = new EmbedBuilder()
          .setTitle(`${classMap[stat.class]} 的能力值`)
          .addFields(
            {
              name: "生命值 (HP)",
              value: `**__${stat.hp}__**`,
              inline: true,
            },
            {
              name: "魔法值 (MP)",
              value: `**__${stat.mp}__**`,
              inline: true,
            },
            {
              name: "攻擊力",
              value: `**__${stat.attack}__**`,
              inline: true,
            },
            {
              name: "防禦力",
              value: `**__${stat.defense}__**`,
              inline: true,
            },
            {
              name: "速度",
              value: `**__${stat.speed}__**`,
              inline: true,
            }
          );
        if (stat.class === player.class) {
          statsEmbed.setColor("Purple");
        } else {
          statsEmbed.setColor("Grey");
        }

        playerClassEmbedList.push(statsEmbed);
      });

      await interaction.editReply({
        embeds: playerClassEmbedList,
      });
    }
  },
};
