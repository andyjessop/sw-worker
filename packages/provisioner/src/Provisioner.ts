import type { WorkerConfigManager } from "../../config/src/WorkerConfigManager";

export class BindingProvisioner {
	#lockConfig: WorkerLockConfig = {
		workers: [],
	};
	#configManager: WorkerConfigManager;

	constructor(config: WorkerConfigManager) {
		this.#configManager = config;
	}

	getSandbox(workerName?: string) {
		const existingInstance = this.#lockConfig.workers.find(
			(worker) => worker.name === workerName,
		);

		if (!existingInstance) {
			const bindings = this.#configManager.getBindings();
		}
	}

	listSandboxes() {
		return this.#lockConfig.workers;
	}
}

type WorkerLockConfig = {
	workers: {
		bindings: unknown[];
		id: string;
		name: string;
	}[];
};
