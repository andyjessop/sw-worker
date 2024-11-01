import type { ZodRawShape, z } from "zod";
import type { Context } from "./context.ts";

export interface Command<T extends ZodRawShape = any> {
	name: string;
	description: string;
	argsSchema: z.ZodObject<T>;
	execute: (context: Context<T>) => Promise<void>;
}

export class CommandRegistry {
	private commands: Record<string, Command> = {};

	registerCommand(command: Command) {
		this.commands[command.name] = command;
	}

	getCommand(name: string): Command {
		if (!this.commands[name]) {
			throw new Error(`Unknown command ${name}`);
		}

		return this.commands[name];
	}

	listCommands(): Command[] {
		return Object.values(this.commands);
	}
}
