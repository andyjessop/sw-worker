import { file } from "bun";
import { join, parse, dirname } from "node:path";
import type { SouvlakiConfig } from "../../../souvlaki-schema/src/types";
import { isValidSouvlakiConfig } from "./is-valid-souvlaki-config";

/**
 * Finds the nearest souvlaki.json file and parses its content using Bun.
 * @param startDir The directory to start searching from (default: current working directory)
 * @returns A promise that resolves to the parsed SouvlakiConfig object
 * @throws Error if souvlaki.json is not found or cannot be parsed
 */
export async function findAndParseSouvlakiConfig(
	startDir: string = process.cwd(),
): Promise<{
	rootPath: string;
	config: SouvlakiConfig;
}> {
	let currentDir = startDir;

	while (currentDir !== parse(currentDir).root) {
		const souvlakiPath = join(currentDir, "souvlaki.json");

		try {
			const souvlakiFile = file(souvlakiPath);
			if (await souvlakiFile.exists()) {
				const fileContent = await souvlakiFile.text();
				const parsedContent = JSON.parse(fileContent);

				if (isValidSouvlakiConfig(parsedContent)) {
					return {
						rootPath: dirname(souvlakiPath),
						config: parsedContent,
					};
				}

				throw new Error("Invalid souvlaki.json structure");
			}
		} catch (error) {
			if (error instanceof Error && error.message !== "File not found") {
				throw error; // Re-throw if it's not a "file not found" error
			}
		}

		// Move up to the parent directory
		currentDir = dirname(currentDir);
	}

	throw new Error("souvlaki.json not found in any parent directory");
}
