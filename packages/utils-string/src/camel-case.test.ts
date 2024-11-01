// camelCase.test.ts
import { describe, expect, test } from "bun:test";
import { toCamelCase } from "./camel-case";

describe("toCamelCase", () => {
	test("should convert space-separated words to camelCase", () => {
		expect(toCamelCase("hello world")).toBe("helloWorld");
		expect(toCamelCase("first second third")).toBe("firstSecondThird");
	});

	test("should handle single words", () => {
		expect(toCamelCase("hello")).toBe("hello");
		expect(toCamelCase("WORLD")).toBe("world");
	});

	test("should convert kebab-case to camelCase", () => {
		expect(toCamelCase("kebab-case-string")).toBe("kebabCaseString");
		expect(toCamelCase("convert-to-camel")).toBe("convertToCamel");
	});

	test("should convert snake_case to camelCase", () => {
		expect(toCamelCase("snake_case_string")).toBe("snakeCaseString");
		expect(toCamelCase("convert_to_camel")).toBe("convertToCamel");
	});

	test("should handle mixed case input", () => {
		expect(toCamelCase("Mixed Case String")).toBe("mixedCaseString");
		expect(toCamelCase("UPPER lower MiXeD")).toBe("upperLowerMixed");
	});

	test("should handle strings with numbers", () => {
		expect(toCamelCase("hello123 world456")).toBe("hello123World456");
		expect(toCamelCase("test-with-123-numbers")).toBe("testWith123Numbers");
	});

	test("should handle strings with special characters", () => {
		expect(toCamelCase("special!@#characters")).toBe("specialCharacters");
		expect(toCamelCase("remove$%^all&*()symbols")).toBe("removeAllSymbols");
	});

	test("should handle strings with multiple consecutive special characters or spaces", () => {
		expect(toCamelCase("multiple   spaces")).toBe("multipleSpaces");
		expect(toCamelCase("special!!!@@@characters")).toBe("specialCharacters");
	});

	test("should handle empty string", () => {
		expect(toCamelCase("")).toBe("");
	});

	test("should handle string with only special characters", () => {
		expect(toCamelCase("!@#$%^&*()")).toBe("");
	});

	test("should preserve existing camelCase", () => {
		expect(toCamelCase("alreadyCamelCase")).toBe("alreadyCamelCase");
		expect(toCamelCase("keepExistingCamelCase")).toBe("keepExistingCamelCase");
	});
});
