import type { Page } from "playwright";

import type { ICategory } from "@ag-crawler/types";

export const spreadModels = async (page: Page) => {
  const categories: Omit<ICategory, "children">[] = [];

  for (const item of await page
    .getByTitle("click to reveal details")
    .elementHandles()) {
    await item.click();
  }

  return categories;
};
