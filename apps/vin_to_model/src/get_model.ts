import type { Page } from "playwright";

export const getModel = async (page: Page) => {
  const item = await page
    .getByRole("link")
    .and(page.getByTitle("click to select"))
    .elementHandle();
  const model = await item?.textContent();

  return model ?? "";
};
