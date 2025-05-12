import { CurrentsConfig, currentsReporter } from "@currents/playwright";
import config from "./playwright.config";

const currentsConfig: CurrentsConfig = {
  projectId: process.env.CURRENTS_PROJECT_ID ?? "xx",
  recordKey: process.env.CURRENTS_RECORD_KEY ?? "yy",
  outputFile: "currents-report.json",
};

export default { ...config, reporter: [currentsReporter(currentsConfig)] };