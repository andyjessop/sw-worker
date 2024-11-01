/**
 * A generic Mutex class for TypeScript.
 * @template T The type of the resource protected by the mutex.
 */
export class Mutex<T> {
	private mutex: Promise<void> = Promise.resolve();
	private resource: T;

	/**
	 * Constructor for the Mutex class.
	 * @param initialResource The initial value of the protected resource.
	 */
	constructor(initialResource: T) {
		this.resource = initialResource;
	}

	/**
	 * Acquires the lock and provides access to the protected resource.
	 * @param callback A function that receives the protected resource and returns a promise.
	 * @returns A promise that resolves with the result of the callback.
	 */
	async lock<R>(callback: (resource: T) => Promise<R>): Promise<R> {
		const release = await this.acquire();
		try {
			return await callback(this.resource);
		} finally {
			release();
		}
	}

	/**
	 * Updates the protected resource.
	 * @param updater A function that receives the current resource and returns the updated resource.
	 */
	async updateResource(updater: (currentResource: T) => T): Promise<void> {
		await this.lock(async (resource) => {
			this.resource = updater(resource);
		});
	}

	/**
	 * Acquires the lock.
	 * @returns A promise that resolves with a release function.
	 */
	private async acquire(): Promise<() => void> {
		const oldMutex = this.mutex;
		let release: (() => void) | undefined;

		this.mutex = new Promise<void>((resolve) => {
			release = resolve;
		});

		await oldMutex;
		return release as () => void;
	}
}
