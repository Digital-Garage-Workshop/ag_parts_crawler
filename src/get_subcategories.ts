import type { Page } from "playwright";

import { baseUrl } from "./";

export const getSubCategories = async (page: Page, category: string) => {
  const navigationPromise = page.waitForNavigation();
  await page.goto(`${baseUrl}/parts/${category}`);
  await navigationPromise;

  const subCategories: {
    href: string;
    name: string;
  }[] = [];

  for (const category of await page
    .locator("[id=page2]")
    .getByRole("link")
    .elementHandles()) {
    const href = await category.getAttribute("href");
    const name = await category.textContent();

    if (href && name) {
      subCategories.push({
        href,
        name,
      });
    }
  }

  return subCategories;
};
