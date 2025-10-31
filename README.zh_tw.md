# discord-bot-rpg

[English](./README.md) | 繁體中文

一隻 RPG 的 Discord 機器人，使用 Discord.js 和 TypeScript 建立。

## 環境變數

在專案的根目錄建立一個 `.env` 檔案，並加入以下變數：

```plaintext
# Discord 機器人
BOT_TOKEN=your_discord_bot_token
BOT_ID=your_discord_bot_id

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SKEY=your_supabase_service_key
```

你可以參考 `.env.sample` 檔案來獲取所需的變數。

## 開發

要啟動開發伺服器，請執行：

```bash
bun run dev
```

## 啟動

```bash
bun run start
```

## 指令

- [x] `/choose-class` - 選擇職業並建立你的 RPG 角色。
- [x] `/profile` - 查看你的 RPG 個人資料或其他使用者的個人資料。
- [x] `/daily` - 領取你的每日獎勵。
