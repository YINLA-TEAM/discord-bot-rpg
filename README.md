# discord-bot-rpg

English | [繁體中文](./README.zh_tw.md)

A Discord bot for RPG games built with Discord.js and TypeScript.

## Environment Variables

Create a `.env` file in the root directory of the project and add the following variables:

```plaintext
# Discord bot configuration
BOT_TOKEN=your_discord_bot_token
BOT_ID=your_discord_bot_id

# Supabase configuration
SUPABASE_URL=your_supabase_url
SUPABASE_SKEY=your_supabase_service_key
```

You can refer to the `.env.sample` file for the required variables.

## Development

To start the development server, run:

```bash
bun run dev
```

## Start

```bash
bun run start
```

## Commands

- [x] `/choose-class` - Choose a class and create your RPG character.
- [x] `/profile` - View your RPG profile or another user's profile.
- [x] `/daily` - Claim your daily rewards.
