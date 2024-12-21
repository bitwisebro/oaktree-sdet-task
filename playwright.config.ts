import { defineConfig, devices } from '@playwright/test';
import { join } from 'path';

export default defineConfig({
    fullyParallel: true,
    retries: 0,
    workers: 3,
    reporter: [
        [`html`, { outputFolder: `./reports/htmlReports/`, open: `never` }],
    ],
    use: {
        headless: true,
        trace: `retain-on-failure`,
        contextOptions: {
            recordVideo: {
                dir: `./reports/videos/`
            },
        },
        screenshot: { mode: `only-on-failure`, fullPage: true },
        video: `retain-on-failure`,
        navigationTimeout: 10000,
        actionTimeout: 20000,
    },
    projects: [
        {
            name: `chrome`,
            testDir: join(__dirname, `src`, `tests`),
            timeout: 0,
            expect: { timeout: 10000},
            use: {
                ...devices[`Desktop Chrome`],
                baseURL: `https://apply.mykaleidoscope.com`,
                launchOptions: {
                    args: [`--start-maximized`, `--window-size=1920,1080`],
                },
                channel: `chrome`
            },
        },
    ],

});