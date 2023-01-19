import type { Page } from "playwright";

import { baseUrl } from "./";

export const getVehicle = async (page: Page, vin: string) => {
  await page.goto(`${baseUrl}/parts/q.html`, {
    waitUntil: "load",
  });

  await page.getByRole("textbox").fill(vin);
  // await page.locator("[name=vin]").fill(vin);
  await page.getByRole("button", { name: "Search" }).click();
  const navigationPromise = page.waitForNavigation();
  await page.getByRole("link", { name: vin }).click();
  await navigationPromise;

  return page.url();
};
