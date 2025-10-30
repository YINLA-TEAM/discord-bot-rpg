import path from "path";
import { Client } from "discord.js";
import { getAllFiles } from "@/functions/utils/fileLoader";

export async function handleEvents(client: Client) {
  const eventsPath = path.join("./src/events");
  const eventFiles = getAllFiles(eventsPath);

  for (const file of eventFiles) {
    const event = await import(file);
    const eventData = event.default;
    if (!eventData?.name || !eventData?.execute) continue;

    if (eventData.once) {
      client.once(eventData.name, (...args) => eventData.execute(...args));
    } else {
      client.on(eventData.name, (...args) => eventData.execute(...args));
    }
  }
}
