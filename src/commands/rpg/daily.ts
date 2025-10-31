import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import { supabase } from "@db/supabaseClient";
import { dailyReward } from "@rpg/economic";
import type { Player } from "@/types/rpg";

export default {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setNameLocalizations({
      "zh-TW": "簽到",
    })
    .setDescription("簽到並且領取你的每日獎勵"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const userId = interaction.user.id;

    const {
      data: player,
      error: fetchError,
    }: { data: Player | null; error: any } = await supabase
      .from("players")
      .select("*")
      .eq("userId", userId)
      .single();

    if (player === null) {
      await interaction.editReply({
        content: `# 你尚未建立 RPG 資料，請先使用 \`/選擇職業\` 選擇職業並建立角色`,
      });
      return;
    }
    if (fetchError) {
      console.log("[錯誤]", fetchError.code, fetchError.message);
      await interaction.editReply({
        content: "# 獲取角色資料時發生錯誤，請稍後再試",
      });
      return;
    }

    const now = new Date();
    const lastActivity = player.last_activity
      ? new Date(player.last_activity)
      : null;

    if (
      lastActivity &&
      now.getUTCFullYear() === lastActivity.getUTCFullYear() &&
      now.getUTCMonth() === lastActivity.getUTCMonth() &&
      now.getUTCDate() === lastActivity.getUTCDate()
    ) {
      await interaction.editReply({
        content: "# 你今天已經簽到過了，請明天再來！",
      });
      return;
    } else {
      let playerDailyStreak = player.daily_streak + 1;
      let playerTotalSignIn = player.total_signin + 1;
      const rewardKey = `day_${Math.min(playerDailyStreak, 7)}`;
      const reward = dailyReward[rewardKey];

      const { error: updateError } = await supabase
        .from("players")
        .update({
          money: player.money + reward.money,
          diamonds: player.diamonds + reward.diamonds,
          daily_streak: playerDailyStreak,
          total_signin: playerTotalSignIn,
          last_signin: now.toISOString(),
          last_activity: now.toISOString(),
        })
        .eq("userId", userId);

      if (updateError) {
        console.log("[錯誤]", updateError.code, updateError.message);
        await interaction.editReply({
          content: "# 更新簽到資料時發生錯誤，請稍後再試",
        });
        return;
      }

      const rewardEmbed = new EmbedBuilder()
        .setTitle("每日簽到獎勵")
        .setDescription(
          `你已成功簽到 **__第 ${playerDailyStreak} 天__**，獲得以下獎勵：`
        )
        .addFields(
          { name: "金錢", value: `**\`${reward.money}\`**`, inline: true },
          { name: "鑽石", value: `**\`${reward.diamonds}\`**`, inline: true }
        )
        .setFooter({ text: "記得每天來簽到領取獎勵喔！" });

      await interaction.editReply({
        embeds: [rewardEmbed],
      });
    }
  },
};
