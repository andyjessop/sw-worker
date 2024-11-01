import { z } from "zod";

// Reusable schemas for global bindings
export const GlobalKvBinding = z.object({
	type: z.literal("kv"),
});

export const GlobalDurableObjectBinding = z.object({
	type: z.literal("durable_object"),
	class_name: z.string(),
});

export const GlobalSecretBinding = z.object({
	type: z.literal("secret"),
	env: z.string(),
});

export const GlobalVariableBinding = z.object({
	type: z.literal("variable"),
	value: z.string(),
});

export const GlobalD1DatabaseBinding = z.object({
	type: z.literal("d1_database"),
	database_name: z.string(),
	migrations_table: z.string(),
	migrations_dir: z.string(),
});

export const GlobalWorkerBinding = z.object({
	type: z.literal("worker"),
	name: z.string(),
});

// Global bindings schema
export const GlobalBindings = z.record(
	z.union([
		GlobalKvBinding,
		GlobalDurableObjectBinding,
		GlobalSecretBinding,
		GlobalVariableBinding,
		GlobalD1DatabaseBinding,
		GlobalWorkerBinding,
	]),
);

// Worker-specific bindings (without requiring a `type`)
export const WorkerKvBinding = z.object({
	type: z.literal("kv").optional(), // Optional for worker-specific bindings
});

export const WorkerDurableObjectBinding = z.object({
	type: z.literal("durable_object").optional(), // Optional for worker-specific bindings
	class_name: z.string(),
});

export const WorkerSecretBinding = z.object({
	env: z.string(), // No `type` field required in worker-specific secrets
});

export const WorkerVariableBinding = z.object({
	value: z.string(), // No `type` field required in worker-specific variables
});

export const WorkerD1DatabaseBinding = z.object({
	database_name: z.string(),
	migrations_table: z.string(),
	migrations_dir: z.string(),
});

// Worker bindings schema (can reference global or define local)
export const WorkerBindings = z.record(
	z.union([
		WorkerKvBinding,
		WorkerDurableObjectBinding,
		WorkerSecretBinding,
		WorkerVariableBinding,
		WorkerD1DatabaseBinding,
		// Reference to global bindings (e.g., "global:GAMES")
		z
			.string()
			.regex(/^global:/),
	]),
);

// GitHub configuration schema
export const GitHubConfig = z.object({
	repo: z.string().optional(),
	branch: z.string().optional(),
	deploy_on_push: z.boolean().optional(),
});

// Build configuration schema
export const BuildConfig = z.object({
	command: z.string(),
	cwd: z.string(),
	built_worker: z.string(),
});

// Environment-specific variables can either be a string (global reference) or an object with a value
const EnvironmentVariableOrGlobalReference = z.union([
	// String reference to global variable (e.g., "global:PAGE_TITLE")
	z
		.string()
		.regex(/^global:/),
	// Object with a value (e.g., { value: "http://local.db.url" })
	WorkerVariableBinding,
]);

// Environment-specific secrets can either be a string (global reference) or an object with an env key
const EnvironmentSecretOrGlobalReference = z.union([
	// String reference to global secret (e.g., "global:DB_PASSWORD")
	z
		.string()
		.regex(/^global:/),
	// Object with an env key (e.g., { env: "DB_PASSWORD" })
	WorkerSecretBinding,
]);

// Environment-specific configuration schema
export const EnvironmentConfig = z.object({
	dev: z
		.object({
			main: z.string(),
			base_dir: z.string(),
		})
		.optional(),
	secrets: z.record(EnvironmentSecretOrGlobalReference),
	variables: z.record(EnvironmentVariableOrGlobalReference),
	routes: z.array(z.string()),
	build: BuildConfig.optional(),
});

// Worker configuration schema
export const WorkerConfig = z.object({
	name: z.string(),
	compatibility_date: z.string().optional(), // Optional for worker_b
	compatbility_flags: z.array(z.string()).optional(), // Optional for worker_b
	main: z.string().optional(), // Optional for worker_a
	bindings: WorkerBindings, // Use worker-specific bindings here, not global ones!
	github: GitHubConfig.optional(),
	environments: z.record(EnvironmentConfig),
});

// Main config schema
export const ConfigSchema = z.object({
	$schema: z.string(), // Relaxed validation for $schema field (can be any string)
	compatibility_date: z.string(), // Top-level compatibility date
	compatibility_flags: z.array(z.string()), // Top-level compatibility flags
	global: GlobalBindings, // Global bindings section
	workers: z.array(WorkerConfig), // Array of workers
});

// TypeScript type for the validated config (inferred from Zod)
export type ConfigType = z.infer<typeof ConfigSchema>;

// Safe parse function as a type guard to validate the config
export function isValidConfig(configData: unknown): configData is ConfigType {
	const result = ConfigSchema.safeParse(configData);

	if (!result.success) {
		console.error("Invalid config:", result.error.format());
		return false;
	}

	return true;
}
