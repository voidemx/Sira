import { Command, type CommandContext, Declare, Container, TextDisplay } from "seyfert";
import { ApplicationIntegrationType, InteractionContextType, MessageFlags } from "seyfert/lib/types/index.js";

@Declare({
    name: "ping",
    description: "Get the bot latency",
    aliases: ["latency"],
    integrationTypes: [ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall],
    contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
    props: {
        cooldown: 5,
        category: "info",
    },
})
export default class PingCommand extends Command {
    public override async run(ctx: CommandContext): Promise<void> {
        const { client } = ctx;

        await ctx.editOrReply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new Container().addComponents(
                    new TextDisplay().setContent("> Pinging..."),
                ),
            ],
        });

        const wsPing: number     = Math.floor(client.gateway.latency);
        const clientPing: number = Math.floor(Date.now() - (ctx.message ?? ctx.interaction)!.createdTimestamp);

        await ctx.editOrReply({
            flags: MessageFlags.IsComponentsV2,
            components: [
                new Container().addComponents(
                    new TextDisplay().setContent(`> Websocket: \`${wsPing}ms\`\n> Roundtrip: \`${clientPing}ms\``),
                ),
            ],
        });
    }
}