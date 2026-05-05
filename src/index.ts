import "dotenv/config";

import { Sira } from "#sira/client/Sira.js";

const client = new Sira();
export { client };

(async (): Promise<void> => await client.run())();