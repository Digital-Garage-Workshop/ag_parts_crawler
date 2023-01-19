import type { Page } from "playwright";

import type { ICategory } from "types";
import { baseUrl } from "./";

export const getSubCategories = async (page: Page, category: string) => {
  const navigationPromise = page.waitForNavigation();
  await page.goto(`${baseUrl}/parts/${category}`);
  await navigationPromise;

  const subCategories: Omit<ICategory, "children">[] = [];

  for (const item of await page
    .locator("[id=page2]")
    .getByRole("link")
    .elementHandles()) {
    const href = await item.getAttribute("href");
    const name = await item.textContent();

    const subCategory: Omit<ICategory, "children"> = {
      href: href ?? "",
      name: name ?? "",
    };

    subCategories.push(subCategory);
  }

  return subCategories;
};
