import os from "node:os";

import { devices, PlaywrightTestConfig } from "@playwright/test";

const countOfCpus = os.cpus().length;
let workers;
if (countOfCpus !== 0) {
	if (countOfCpus <= 4) {
		workers = countOfCpus; // utilize all logical processors
	} else {
		// if the number of CPUs is greater than 4, we set it to 4 to limit RAM usage
		workers = 4;
	}
}

const isInCi = process.env.CI === "true";

const config: PlaywrightTestConfig = {
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

	expect: {
		toHaveScreenshot: {
			// screenshots are often not exactly the same for various reasons - allow 5% of pixel difference
			maxDiffPixelRatio: 0.05,
			pathTemplate: `{testDir}/{testFilePath}-snapshots/{arg}-{projectName}-docker{ext}`,
		},
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
			// start the Playwright server in a docker container
			command: createDockerRunCommand(36719),
			url: `http://127.0.0.1:36719/`,
			stdout: "pipe",
			stderr: "pipe",
			timeout: 30_000,
			gracefulShutdown: {
				signal: "SIGTERM",
				timeout: 10_000,
			},
			reuseExistingServer: !isInCi,
		},
		{
			command: "npm run start",
			url: "http://localhost:5173",
			reuseExistingServer: !isInCi,
		},
	],
};

export default config;

function createDockerRunCommand(port: number) {
	const dockerRunCommand = `docker run --rm --init --workdir /home/pwuser --user pwuser --network host mcr.microsoft.com/playwright:v1.51.1-noble /bin/sh -c "npx -y playwright@1.51.1 run-server --port ${port} --host 0.0.0.0"`;
	return dockerRunCommand;
}
