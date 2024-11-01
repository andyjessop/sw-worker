import { zodToJsonSchema } from "zod-to-json-schema";
import { ConfigSchema } from "./types";

const jsonSchema = zodToJsonSchema(ConfigSchema, "souvlakiSchema");

// biome-ignore lint/suspicious/noExplicitAny:
(jsonSchema.definitions as any).souvlakiSchema.properties.$schema = {
	type: "string",
};

Bun.write("./dist/souvlaki-schema.json", JSON.stringify(jsonSchema, null, 2));

console.log(
	"souvlaki.json schema written to packages/souvlaki-schema/dist/souvlaki-schema.json",
);
