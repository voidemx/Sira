import { setTimeout } from "node:timers/promises";
import {
    createMiddleware,
    Container,
    TextDisplay,
    type AnyContext,
    type LimitedCollection,
    type MiddlewareContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types/index.js";

const getKey = (context: AnyContext): string => {
    const authorId: string = context.author.id;

    if (context.isChat() || context.isMenu() || context.isEntryPoint())
        return `${authorId}:${context.fullCommandName}`;

    if (context.isModal() || context.isComponent())
        return `${authorId}:${context.customId}`;

    return `${authorId}:unknown`;
};

export const checkCooldown: MiddlewareContext<void, AnyContext> = createMiddleware<void>(async ({ context, next, pass }) => {
    if (context.isComponent()) return pass();

    const { client, command } = context;
    const collection: LimitedCollection<string, number> = client.cooldowns;

    const cooldown: number = (command.props?.cooldown ?? 3) * 1000;
    const now: number = Date.now();
    const key: string = getKey(context);
    const raw: number | undefined = collection.get(key);

    if (raw !== undefined) {
        const time: number = Math.abs(raw);

        if (now < time) {
            if (raw < 0) return pass();

            const remaining: number = time - now;
            
            collection.set(key, -time, remaining);

            await context.editOrReply({
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                components: [
                    new Container().addComponents(
                        new TextDisplay().setContent(
                            `> You're on cooldown. Try again <t:${Math.floor(time / 1000)}:R>.`,
                        ),
                    ),
                ],
            });

            void setTimeout(remaining).then((): void => void context.deleteResponse().catch((): null => null));

            return pass();
        }
    }

    collection.set(key, now + cooldown, cooldown);
    return next();
});