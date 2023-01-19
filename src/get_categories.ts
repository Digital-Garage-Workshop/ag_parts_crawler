import type { Page } from "playwright";

import type { ICategory } from "./";

export const getCategories = async (page: Page, vehicle: string) => {
  const categories: ICategory[] = [];

  for (const category of await page
    .locator("[id=page2]")
    .getByRole("link")
    .elementHandles()) {
    const href = await category.getAttribute("href");
    const name = await category.textContent();

    if (href && name) {
      categories.push({
        href,
        name,
        children: [],
      });
    }
  }

  return categories;
};
