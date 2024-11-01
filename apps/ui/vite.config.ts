import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { env, nodeless, cloudflare, type Environment } from "unenv";
import { VitePWA } from "vite-plugin-pwa";

const _env = env(nodeless, cloudflare);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			strategies: "injectManifest",
			srcDir: "src",
			filename: "service-worker.ts",
			injectRegister: "auto",
		}),
	],
	resolve: {
		alias: _env.alias,
	},
});
