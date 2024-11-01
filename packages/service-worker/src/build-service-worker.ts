import dedent from "dedent";
import { findAndParseSouvlakiConfig } from "./utils/find-and-parse-souvlaki-config";
import minimist from "minimist";
import { resolve, dirname, join } from "node:path";
import fs from "node:fs/promises";
import * as esbuild from "esbuild";
import os from "node:os";
import crypto from "node:crypto";
import { toCamelCase } from "../../utils-string/src/camel-case";

export async function buildServiceWorker(outfile?: string) {
	const args = minimist(process.argv);
	const out = outfile ?? args.outfile;

	if (!out) {
		throw new Error("No outfile specified");
	}

	let tempEntryPath: string | null = null;

	try {
		// Ensure the directory exists
		await fs.mkdir(dirname(out), { recursive: true });

		const { config, rootPath } = await findAndParseSouvlakiConfig();

		// Create a temporary entry point file
		const entryPointContent = dedent`
			${config.workers
				.map(
					(worker, ndx) =>
						`import ${toCamelCase(worker.name)} from '${resolve(rootPath, worker.main)}';`,
				)
				.join("\n")}

			export default {
			${config.workers
				.map(
					(worker, ndx) =>
						`  '${worker.name}': { fetch: ${toCamelCase(worker.name)}.fetch }`,
				)
				.join(",\n")}
			};`;

		// Create a unique temporary file name
		const tempFileName = `worker-entry-${crypto.randomBytes(8).toString("hex")}.js`;
		tempEntryPath = join(os.tmpdir(), tempFileName);
		await fs.writeFile(tempEntryPath, entryPointContent);

		// Build using esbuild
		const result = await esbuild.build({
			entryPoints: [tempEntryPath],
			bundle: true,
			format: "iife",
			globalName: "workers",
			outfile: out,
			platform: "browser",
			target: "es2020",
			minify: true,
			sourcemap: true,
		});

		// Add glue code
		const glueCode = `
self.addEventListener('fetch', (event) => {
  console.log('Fetch event:', event.request.url);
  // Add your routing logic here
});
`;

		const finalCode = (await fs.readFile(out, "utf-8")) + glueCode;
		await fs.writeFile(out, finalCode);

		console.log(`Service worker built and saved to ${out}`);
	} catch (error) {
		console.error(
			"Error:",
			error instanceof Error ? error.message : String(error),
		);
	} finally {
		// Clean up the temporary entry point file
		if (tempEntryPath) {
			try {
				await fs.unlink(tempEntryPath);
			} catch (unlinkError) {
				console.error("Error deleting temporary file:", unlinkError);
			}
		}
	}
}

// If running this file directly
if (import.meta.main) {
	await buildServiceWorker();
}
