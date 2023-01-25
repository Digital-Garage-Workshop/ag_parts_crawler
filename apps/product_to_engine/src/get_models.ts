//
import type { Page } from "playwright";

//
import { baseUrl, timeout } from "./config";
import { generateCSV } from "./generate_csv";
import { spreadModels } from "./spread_models";

export const getModels = async (
  page: Page,
  part_number: string,
  parsed: Record<string, string>,
  startedAt: string
) => {
  const models: string[] = [];

  try {
    await page.goto(`${baseUrl}/parts/xref?s=${part_number}`, {
      waitUntil: "load",
    });
    await spreadModels(page);

    for (const item of await page.locator(".smtb").all()) {
      for (const row of await item.getByRole("row").all()) {
        for (const cell of await row.getByRole("cell").nth(2).all()) {
          const model = await cell.textContent();
          if (model && model !== "Matching Models:") {
            const engineCode = parsed[model];
            if (engineCode) {
              models.push(engineCode);
            }
          }
        }
      }
    }

    await page.waitForTimeout(timeout);
  } catch (error) {
    throw error;
  } finally {
    if (models.length > 0) {
      await generateCSV(
        [
          {
            key: part_number,
            children: models,
          },
        ],
        startedAt
      );
    }
  }
};
