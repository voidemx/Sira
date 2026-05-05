import { createEvent, Container, TextDisplay } from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";
import config from "#sira/config/default.config.js";

export default createEvent({
    data: { name: "messageCreate" },
    async run(message, client): Promise<void> {
        if (message.author.bot) return;

        const mentionRegex = new RegExp(`^<@!?${client.me.id}>( |)$`);
        if (!message.content.match(mentionRegex)) return;

        await message.reply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new Container().addComponents(
                    new TextDisplay().setContent(
                        `> Hey! I'm **${client.me.username}**.\n> My prefix is \`${config.defaultPrefix}\``,
                    ),
                ),
            ],
        });
    },
});