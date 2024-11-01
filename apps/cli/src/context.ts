import type { ConfigType } from "../../../packages/souvlaki-schema/src/types";
import type { GlobalArgs } from "./global-args.ts";
import type { Logger } from "./logger.ts";

export interface Context<T = any> {
	globalArgs: GlobalArgs;
	commandArgs: T;
	config: ConfigType;
	logger: Logger;
}

export function buildContext<T = any>(
	globalArgs: GlobalArgs,
	commandArgs: T,
	config: ConfigType,
	logger: Logger,
): Context {
	return {
		globalArgs,
		commandArgs,
		config,
		logger,
	};
}
