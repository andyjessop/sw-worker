import {
	ConfigSchema,
	type ConfigType,
} from "../../../packages/souvlaki-schema/src/types";

class ParseConfigError extends Error {}

export async function parseConfig(path: string) {
	try {
		const file = Bun.file(path);
		const json = await file.text();
		return JSON.parse(json);
	} catch (e) {
		if (e instanceof SyntaxError) {
			throw new ParseConfigError(e.message);
		}
		throw e;
	}
}

class ValidateConfigError extends Error {}

export function validateConfig(config: unknown): ConfigType {
	const { data, error, success } = ConfigSchema.safeParse(config);

	if (!success) {
		throw new ValidateConfigError(error.message);
	}

	return data;
}
