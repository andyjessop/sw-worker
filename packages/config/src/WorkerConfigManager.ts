import type { WorkerConfig } from "../../types/src/types";

export class WorkerConfigManager {
	#config: WorkerConfig;

	constructor(config: WorkerConfig) {
		this.#config = config;
	}

	getBindings() {
		return this.#config.bindings;
	}

	getCompatibilityDate() {
		return this.#config.compatibilityDate;
	}

	getCompatibilityFlags() {
		return this.#config.compatibilityFlags ?? [];
	}

	getName() {
		return this.#config.name;
	}

	getEnvironments() {
		return this.#config.environments ?? [];
	}
}
