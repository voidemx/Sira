import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { createEvent } from "seyfert";
import { ActivityType, PresenceUpdateStatus } from "seyfert/lib/types/index.js";

export default createEvent({
    data: { name: "botReady", once: true },
    async run(user, client): Promise<void> {
        client.readyTimestamp = Date.now();

        client.logger.info(`[Client] ${user.username} is online!`);

        client.gateway.setPresence({
            afk: false,
            since: Date.now(),
            status: PresenceUpdateStatus.Online,
            activities: [{ name: "In the void", type: ActivityType.Playing }],
        });

        const cacheDir  = join(process.cwd(), "cache");
        const cachePath = join(cacheDir, "commands.json");

        if (!existsSync(cacheDir)) await mkdir(cacheDir, { recursive: true });
        await client.uploadCommands({ cachePath });
    },
});