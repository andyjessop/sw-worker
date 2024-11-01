// main.ts
import parse from "minimist";
import { CommandRegistry } from "./command-registry.ts";
import { parseConfig, validateConfig } from "./config-utils.ts";
import { buildContext } from "./context.ts";
import { GlobalArgsSchema } from "./global-args.ts";
import { Logger } from "./logger.ts";

async function main() {
	const rawArgs = parse(Bun.argv.slice(2)); // Skip first two args (node/bun executable)

	const { _: positionalArgs, ...commandRawArgs } = rawArgs;
	// Extract the command name (first positional argument)
	const [commandName] = positionalArgs;

	const registry = new CommandRegistry();
	// Register commands (this can be modularized further)
	await registerMyCommands(registry);

	if (!commandName) {
		console.error("No command specified. Available commands are:");
		for (const cmd of registry.listCommands()) {
			console.log(`- ${cmd.name}: ${cmd.description}`);
		}
		process.exit(1);
	}

	const command = registry.getCommand(commandName);

	if (!command) {
		console.error(`Unknown command "${commandName}". Available commands are:`);

		for (const cmd of registry.listCommands()) {
			console.log(`- ${cmd.name}: ${cmd.description}`);
		}
		process.exit(1);
	}

	// Validate global args
	const globalArgs = GlobalArgsSchema.parse(rawArgs);

	// Validate command-specific args
	const commandArgs = command.argsSchema.parse(commandRawArgs);

	// Parse and validate config file (assuming config is always required)
	const configJson = await parseConfig(commandArgs.configPath);
	const config = validateConfig(configJson);

	const logger = new Logger();

	// Build context with both global and command-specific args
	const context = buildContext(globalArgs, commandArgs, config, logger);

	// Execute the selected command with the built context
	await command.execute(context);
}

async function registerMyCommands(registry: CommandRegistry) {
	const mod = await import("./commands/start/start.ts");
	mod.register(registry);
}

void main();
