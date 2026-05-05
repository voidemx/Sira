import { Client, LimitedCollection, LimitedMemoryAdapter } from "seyfert";
import { checkCooldown } from "#sira/middlewares/cooldown.js";
import config from "#sira/config/default.config.js";

/**
 * Class representing the main client of the bot.
 * @extends Client
 * @class Sira
 */
export class Sira extends Client<true> {
    /**
     * The client cooldowns collection.
     * @type {LimitedCollection<string, number>}
     * @readonly
     */
    readonly cooldowns: LimitedCollection<string, number> = new LimitedCollection<string, number>();

    /**
     * The timestamp when the client is ready.
     * @type {number}
     * @default 0
     */
    public readyTimestamp: number = 0;

    /**
     * Creates an instance of the Sira client.
     */
    constructor() {
        super({
            globalMiddlewares: ["checkCooldown"],
            allowedMentions: {
                replied_user: false,
                parse: ["roles", "users"],
            },
            commands: {
                reply: (): boolean => true,
                prefix: (): string[] => [config.defaultPrefix],
                deferReplyResponse: (): { content: string } => ({
                    content: "Processing...",
                }),
            },
        });
    }

    /**
     * Start the main process of the client.
     * @returns {Promise<void>}
     */
    public async run(): Promise<void> {
        this.setServices({
            middlewares: { checkCooldown },
            cache: {
                adapter: new LimitedMemoryAdapter(),
                disabledCache: {
                    bans: true,
                    emojis: true,
                    stickers: true,
                    roles: true,
                    overwrites: true,
                    messages: true,
                    presences: true,
                    stageInstances: true,
                },
            },
        });

        await this.start();
    }
}