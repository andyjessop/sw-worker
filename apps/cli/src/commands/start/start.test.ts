import { describe, expect, it } from "bun:test";
import { CommandRegistry } from "../../command-registry.ts";
import { Logger } from "../../logger.ts";
import { register as registerMyCommand } from "./start.ts";

describe("my-command", () => {
	it("should execute successfully with valid context", async () => {
		const logger = new Logger();
		const registry = new CommandRegistry();
		registerMyCommand(registry);

		const myCommand = registry.getCommand("my-command");
		expect(myCommand).toBeDefined(); // Ensure the command was registered

		const mockContext = {
			logger,
			config: { someConfigKey: "someConfigValue" },
			globalArgs: { verbose: false },
			commandArgs: { configPath: "./mock-config.json" },
		};

		await myCommand.execute(mockContext);
	});
});