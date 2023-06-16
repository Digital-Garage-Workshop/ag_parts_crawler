import type { Page } from "playwright";

export const getEngine = async (page: Page) => {
  const engine = await page
    .locator(".t2 tr:has-text('ENGINE:') td:nth-child(2)")
    .innerText();
  return engine.replace(":", "");
};
