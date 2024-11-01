// mutex.test.ts
import { describe, expect, test, mock } from "bun:test";
import { Mutex } from "./Mutex";

describe("Mutex", () => {
	test("should initialize with the provided resource", () => {
		const initialResource = [1, 2, 3];
		const mutex = new Mutex(initialResource);

		return mutex.lock(async (resource) => {
			expect(resource).toEqual(initialResource);
		});
	});

	test("should allow access to the resource through lock", async () => {
		const mutex = new Mutex<number[]>([]);

		await mutex.lock(async (array) => {
			array.push(1);
		});

		const result = await mutex.lock(async (array) => array.length);
		expect(result).toBe(1);
	});

	test("should ensure mutual exclusion", async () => {
		const mutex = new Mutex<number[]>([]);
		const delay = (ms: number) =>
			new Promise((resolve) => setTimeout(resolve, ms));

		const addItem = async (item: number) => {
			await mutex.lock(async (array) => {
				await delay(10); // Simulate some async work
				array.push(item);
			});
		};

		await Promise.all([addItem(1), addItem(2), addItem(3)]);

		const result = await mutex.lock(async (array) => [...array]);
		expect(result).toEqual([1, 2, 3]);
	});

	test("should allow updating the resource", async () => {
		const mutex = new Mutex<string>("initial");

		await mutex.updateResource((current) => `${current} updated`);

		const result = await mutex.lock(async (resource) => resource);
		expect(result).toBe("initial updated");
	});

	test("should handle errors in lock callback", async () => {
		const mutex = new Mutex<number[]>([]);
		const error = new Error("Test error");

		expect(
			mutex.lock(async () => {
				throw error;
			}),
		).rejects.toThrow("Test error");

		// The mutex should still be usable after an error
		await mutex.lock(async (array) => {
			array.push(1);
		});

		const result = await mutex.lock(async (array) => array.length);
		expect(result).toBe(1);
	});

	test("should release the lock even if the callback throws", async () => {
		const mutex = new Mutex<number>(0);
		const error = new Error("Test error");

		const mockCallback = mock(() => {
			throw error;
		});

		expect(mutex.lock(mockCallback)).rejects.toThrow("Test error");

		// The lock should be released, allowing this to execute immediately
		await mutex.lock(async (num) => {
			expect(num).toBe(0);
		});
	});

	test("should queue lock requests", async () => {
		const mutex = new Mutex<number[]>([]);
		const delay = (ms: number) =>
			new Promise((resolve) => setTimeout(resolve, ms));

		const results: number[] = [];

		await Promise.all([
			mutex.lock(async (array) => {
				await delay(30);
				array.push(1);
				results.push(1);
			}),
			mutex.lock(async (array) => {
				await delay(20);
				array.push(2);
				results.push(2);
			}),
			mutex.lock(async (array) => {
				await delay(10);
				array.push(3);
				results.push(3);
			}),
		]);

		expect(results).toEqual([1, 2, 3]);

		const finalArray = await mutex.lock(async (array) => [...array]);
		expect(finalArray).toEqual([1, 2, 3]);
	});
});
