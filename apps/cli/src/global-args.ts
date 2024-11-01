// global-args.ts
import { z } from "zod";

export const GlobalArgsSchema = z.object({
	verbose: z.boolean().default(false),
});

export type GlobalArgs = z.infer<typeof GlobalArgsSchema>;
