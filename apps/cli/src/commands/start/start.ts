// commands/my-command.ts
import { z } from "zod";
import type { CommandRegistry } from "../../command-registry.ts";
import type { Context } from "../../context.ts";

const MyCommandArgsSchema = z.object({
	configPath: z.string(),
});
type MyCommandArgs = z.infer<typeof MyCommandArgsSchema>;

async function execute(context: Context<MyCommandArgs>) {
	const { logger, config } = context;

	logger.info("Executing my-command");
}

export function register(registry: CommandRegistry) {
	registry.registerCommand({
		name: "start",
		description: "A custom command",
		argsSchema: MyCommandArgsSchema,
		execute,
	});
}
