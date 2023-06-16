import type { Page } from "playwright";

import { baseUrl, timeout } from "./config";
import { getEngine } from "./get_engine";
import { getModel } from "./get_model";

export const getVehicle = async (page: Page, vin: string) => {
  try {
    await page.goto(`${baseUrl}/parts/q.html`, {
      waitUntil: "load",
    });

    await page.getByRole("textbox").fill(vin);
    await page.getByRole("button", { name: "Search" }).click();

    if ((await page.getByText("Warning:").count()) > 0) {
      const warning = await page.getByText("Warning:").textContent();
      if (warning) {
        const message = warning
          .match(/\s\*\sWarning:.*/g)
          ?.find((match) => match);
        if (message) {
          console.error(`${message}: ${vin}`);
          return {
            vin,
            model: "",
            engine: "",
          };
        }
      }
    }
    if ((await page.getByText("No records found").count()) > 0) {
      return {
        vin,
        model: "",
        engine: "",
      };
    }

    const model = await getModel(page);
    const engine = await getEngine(page);

    return {
      vin,
      model,
      engine,
    };
  } catch (error) {
    throw error;
  }
};
