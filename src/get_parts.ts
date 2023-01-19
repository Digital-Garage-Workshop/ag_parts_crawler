import type { Page } from "playwright";

import type { IPart } from "types";
import { baseUrl } from "./";

export const getParts = async (page: Page, category: string) => {
  const navigationPromise = page.waitForNavigation();
  await page.goto(`${baseUrl}/parts/${category}`);
  await navigationPromise;

  const parts: IPart[] = [];
  for (const item of await page.locator(".h >> xpath=..").all()) {
    const [header, ...children] = await item.getByRole("row").all();
    const [code, name] = await header.getByRole("cell").all();

    const part: IPart = {
      code: (await code.textContent()) ?? "",
      name: (await name.textContent()) ?? "",
      children: await Promise.all(
        children.map(async (child) => {
          const [code, name] = await child.getByRole("cell").all();

          return {
            code: (await code.textContent()) ?? "",
            name: (await name.textContent()) ?? "",
          };
        })
      ),
    };

    parts.push(part);
  }

  return parts;
};
