import os from "node:os";

import { defineConfig, devices } from "@playwright/test";

const countOfCpus = os.cpus().length;
const workers = countOfCpus ? Math.min(countOfCpus, 4) : undefined;

const isInCi = process.env.CI === "true";

export default defineConfig({
	testDir: "./e2e-tests",
	fullyParallel: true,
	// fail a Playwright run in CI if some test.only is in the source code
	forbidOnly: isInCi,
	retries: isInCi ? 1 : 0,
	workers,
	reporter: isInCi ? [["html"], ["github"]] : "html",

	use: {
		baseURL: `http://localhost:5173`,

		// ensure consistent timezone and locale
		timezoneId: "America/Los_Angeles",
		locale: "en-US",

		// always capture trace and video (seems to not have significant performance impact)
		trace: "on",
		video: "on",
	},

	projects: [
		{
			name: "chromium",
			use: {
				...devices["Desktop Chrome"],
				// opt into "New Headless" chromium (https://playwright.dev/docs/browsers#chromium-new-headless-mode, https://developer.chrome.com/docs/chromium/headless)
				channel: "chromium",
			},
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],

	webServer: [
		{
			command: "npm run start",
			url: "http://localhost:5173",
			reuseExistingServer: !isInCi,
		},
	],
});
