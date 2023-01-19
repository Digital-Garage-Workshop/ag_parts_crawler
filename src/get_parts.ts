import type { Page } from "playwright";

import { baseUrl } from "./";
import type { IPart } from "./";

export const getParts = async (page: Page, category: string) => {
  const navigationPromise = page.waitForNavigation();
  await page.goto(`${baseUrl}/parts/${category}`);
  await navigationPromise;

  return await page.$$eval(".h", (parts) => {
    return parts
      .map((part) => {
        const code = part.querySelector("td:nth-child(1)")?.textContent;
        const name = part.querySelector("td:nth-child(2)")?.textContent;

        return {
          code,
          name,
        };
      })
      .filter(
        ({ code, name }) => typeof code === "string" && typeof name === "string"
      ) as IPart[];
  });
};
