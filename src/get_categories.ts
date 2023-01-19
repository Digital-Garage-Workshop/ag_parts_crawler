import type { Page } from "playwright";

import type { ICategory } from "types";

export const getCategories = async (page: Page, vehicle: string) => {
  const categories: Omit<ICategory, "children">[] = [];

  for (const item of await page
    .locator("[id=page2]")
    .getByRole("link")
    .elementHandles()) {
    const href = await item.getAttribute("href");
    const name = await item.textContent();

    const category: Omit<ICategory, "children"> = {
      href: href ?? "",
      name: name ?? "",
    };

    categories.push(category);
  }

  return categories;
};
