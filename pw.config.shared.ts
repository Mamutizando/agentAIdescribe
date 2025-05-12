import { CurrentsFixtures, CurrentsWorkerFixtures } from "@currents/playwright";
import { defineConfig, devices } from "@playwright/test";

const config = defineConfig<CurrentsFixtures, CurrentsWorkerFixtures>({
    timeout: 45000,
  
    fullyParallel: false,
  
    expect: {
      timeout: 8000,
    },
  
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 1,
    workers: process.env.CI ? 6 : 2,

    reporter: process.env.CI ?? 'html',
  
    use: {
      actionTimeout: 0,
      trace: "on",
      video: "on",
      screenshot: "on",
      // We can disable Currents fixtures if no project ID is provided
      currentsFixturesEnabled: !!process.env.CURRENTS_PROJECT_ID,
    },
  
    projects: [
      {
        name: "stage",
        retries: 2,
        use: {
          ...devices["Desktop Chrome"],
          baseURL: 'https://.lojaintegrada-staging.com.br'
        },
      },
      {
        name: "stage_render",
        retries: 2,
        use: {
          ...devices["Desktop Chrome"],
          baseURL: 'https://-preview.lojas.li'
        },
      },      
      {
        name: "prod",
        retries: 2,
        use: {
          ...devices["Desktop Chrome"],
          baseURL: 'https://.lojaintegrada.com.br'
        },
      }           
    ],
  
    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    outputDir: "test-results/",
  });
  
  export default config;