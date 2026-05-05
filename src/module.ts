import type { ParseClient, ParseMiddlewares } from "seyfert";
import type { Sira } from "#sira/client/Sira.js";
import type { checkCooldown } from "./middlewares/cooldown.js";

declare module "seyfert" {
    interface UsingClient extends ParseClient<Sira> {}
    interface RegisteredMiddlewares extends ParseMiddlewares<{ checkCooldown: typeof checkCooldown }> {}
    interface ExtraProps {
        cooldown?: number;
        category?: string;
    }
    interface InternalOptions {
        withPrefix: true;
    }
}