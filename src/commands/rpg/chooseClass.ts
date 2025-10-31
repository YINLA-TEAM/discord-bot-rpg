import { EmbedBuilder, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import { supabase } from "@db/supabaseClient";
import { classStats } from "@rpg/classes";
import type { CharacterClass, Player, PlayerClassStats } from "@/types/rpg";

const classMap: Record<CharacterClass | any, string> = {
  warrior: "戰士",
  mage: "法師",
  thief: "盜賊",
};

export default {
  data: new SlashCommandBuilder()
    .setName("choose-class")
    .setNameLocalizations({
      "zh-TW": "選擇職業",
    })
    .setDescription("選擇你想要遊玩的職業")
    .addStringOption((option) =>
      option
        .setName("class")
        .setNameLocalizations({
          "zh-TW": "職業",
        })
        .setDescription("你想要選擇的職業")
        .setRequired(true)
        .addChoices(
          { name: "戰士", value: "warrior" },
          { name: "法師", value: "mage" },
          { name: "盜賊", value: "thief" }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const userId = interaction.user.id;
    const username = interaction.user.username;
    const chosenClass = interaction.options.getString(
      "class"
    ) as CharacterClass;

    const { data: existing, error: fetchError } = await supabase
      .from("players")
      .select("*, player_class_stats(*)")
      .eq("userId", userId)
      .single();

    if (existing) {
      await interaction.editReply({
        content: `# 你已經選擇過職業(**__${
          classMap[existing.class]
        }__**)了，無法再次選擇`,
      });
      return;
    }

    if (fetchError && fetchError.code !== "PGRST116") {
      console.log("[錯誤]", fetchError.code, fetchError.message);
      await interaction.editReply({
        content: "# 獲取角色資料時發生錯誤，請稍後再試",
      });
      return;
    }

    const profile: Player = {
      userId,
      username,
      class: chosenClass,
      level: 0,
      experience: 0,
      money: 0,
      diamonds: 0,
      daily_streak: 0,
      total_signin: 0,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
    };

    const playerClassStats: PlayerClassStats = {
      userId,
      class: chosenClass,
      hp: classStats[chosenClass].hp,
      mp: classStats[chosenClass].mp,
      attack: classStats[chosenClass].attack,
      defense: classStats[chosenClass].defense,
      speed: classStats[chosenClass].speed,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
    };

    const { error: playerError } = await supabase
      .from("players")
      .insert(profile);
    const { error: statsError } = await supabase
      .from("player_class_stats")
      .insert(playerClassStats);

    if (playerError) {
      console.error("[錯誤] Insert player error:", playerError);
      await interaction.editReply({
        content: "# 創建角色時發生錯誤，請稍後再試",
      });
      return;
    } else if (statsError) {
      console.error("[錯誤] Insert class stats error:", statsError);
      await interaction.editReply({
        content: "# 創建角色屬性時發生錯誤，請稍後再試",
      });
      return;
    }
    const embedList: EmbedBuilder[] = [];

    const chooseClassEmbed = new EmbedBuilder()
      .setTitle("歡迎來到 RPG 世界！")
      .setDescription(
        `你已成功選擇職業 __**${classMap[chosenClass]}**__ ！開始你的冒險吧！`
      )
      .setColor("Green");
    const classStatsEmbed = new EmbedBuilder()
      .setTitle(`${classMap[chosenClass]} 的初始屬性`)
      .setColor("Blue")
      .addFields([
        {
          name: "生命值 (HP)",
          value: `\`${classStats[chosenClass].hp.toString()}\``,
          inline: true,
        },
        {
          name: "魔力 (MP)",
          value: `\`${classStats[chosenClass].mp.toString()}\``,
          inline: true,
        },
        {
          name: "攻擊力 (ATK)",
          value: `\`${classStats[chosenClass].attack.toString()}\``,
          inline: true,
        },
        {
          name: "防禦力 (DEF)",
          value: `\`${classStats[chosenClass].defense.toString()}\``,
          inline: true,
        },
        {
          name: "速度 (SPD)",
          value: `\`${classStats[chosenClass].speed.toString()}\``,
          inline: true,
        },
      ])
      .setFooter({
        text: "祝你在這個世界中冒險愉快！",
      })
      .setTimestamp();

    embedList.push(chooseClassEmbed);
    embedList.push(classStatsEmbed);

    await interaction.editReply({
      embeds: embedList,
    });
  },
};
