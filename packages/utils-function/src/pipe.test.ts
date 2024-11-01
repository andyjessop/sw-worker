import { expect, test, describe } from "bun:test";
import { pipe } from "./pipe"; // Adjust this import path as needed

describe("pipe function", () => {
	test("should return the initial value when no functions are provided", () => {
		const result = pipe(5);
		expect(result).toBe(5);
	});

	test("should apply a single function correctly", () => {
		const addOne = (x: number) => x + 1;
		const result = pipe(5, addOne);
		expect(result).toBe(6);
	});

	test("should apply multiple functions in order", () => {
		const addOne = (x: number) => x + 1;
		const double = (x: number) => x * 2;
		const result = pipe(5, addOne, double);
		expect(result).toBe(12);
	});

	test("should handle functions that change the type", () => {
		const addOne = (x: number) => x + 1;
		const toAString = (x: number) => x.toString();
		const appendExclamation = (x: string) => `${x}!`;
		const result = pipe(5, addOne, toAString, appendExclamation);
		expect(result).toBe("6!");
	});

	test("should work with async functions", async () => {
		const addOneAsync = async (x: number) => x + 1;
		const doubleAsync = async (x: number) => x * 2;
		const result = await pipe(5, addOneAsync, doubleAsync);
		expect(result).toBe(12);
	});

	test("should handle the maximum number of functions (8)", () => {
		const addOne = (x: number) => x + 1;
		const result = pipe(
			0,
			addOne,
			addOne,
			addOne,
			addOne,
			addOne,
			addOne,
			addOne,
			addOne,
		);
		expect(result).toBe(8);
	});

	test("should maintain type safety", () => {
		const numToString = (x: number) => x.toString();
		const stringToNum = (x: string) => parseInt(x, 10);
		const result = pipe(5, numToString, stringToNum);
		expect(result).toBe(5);
		// TypeScript should catch this error:
		// @ts-expect-error
		pipe(5, numToString, addOne);
	});

	test("should work with object transformations", () => {
		const addName = (obj: {}) => ({ ...obj, name: "John" });
		const addAge = (obj: { name: string }) => ({ ...obj, age: 30 });
		const result = pipe({}, addName, addAge);
		expect(result).toEqual({ name: "John", age: 30 });
	});
});
