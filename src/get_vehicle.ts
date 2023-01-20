import type { Page } from "playwright";
import produce from "immer";

import type { ICategory, ISubCategory } from "types";

import { baseUrl, timeout } from "./config";
import { generateCSV } from "./generate_csv.js";
import { generateJSON } from "./generate_json.js";
import { getCategories } from "./get_categories.js";
import { getParts } from "./get_parts.js";
import { getSubCategories } from "./get_subcategories.js";

export const getVehicle = async (
  page: Page,
  vin: string,
  logger?: (vehicleProgress: string) => void
) => {
  let data: Record<string, ICategory<Record<string, ISubCategory>>> = {};

  try {
    await page.goto(`${baseUrl}/parts/q.html`, {
      waitUntil: "load",
    });

    await page.getByRole("textbox").fill(vin);
    await page.getByRole("button", { name: "Search" }).click();

    if ((await page.getByText("Warning:").count()) > 0) {
      const warning = await page.getByText("Warning:").textContent();
      if (warning) {
        const message = warning
          .match(/\s\*\sWarning:.*/g)
          ?.find((match) => match);
        if (message) {
          throw Error(message);
        }
      }
    }

    const navigationPromise = page.waitForNavigation();
    await page.getByRole("link", { name: vin }).click();
    await navigationPromise;

    //
    const categories = await getCategories(page, page.url());
    for (const category of categories) {
      data = produce(data, (draft) => {
        draft[category.name] = {
          href: category.href,
          name: category.name,
          children: {},
        };
      });

      const subCategories = await getSubCategories(page, category.href);
      for (const subCategory of subCategories) {
        data = produce(data, (draft) => {
          draft[category.name].children[subCategory.name] = {
            href: subCategory.href,
            name: subCategory.name,
            children: [],
          };
        });

        if (logger) {
          logger(
            `CATEGORY: ${
              categories.map(({ name }) => name).indexOf(category.name) + 1
            }/${categories.length} SUBCATEGORY: ${
              subCategories.map(({ name }) => name).indexOf(subCategory.name) +
              1
            }/${subCategories.length}`
          );
        }

        const parts = await getParts(page, subCategory.href);
        data = produce(data, (draft) => {
          draft[category.name].children[subCategory.name].children = parts;
        });

        await page.waitForTimeout(timeout);
      }
    }
  } catch (error) {
    throw error;
  } finally {
    await generateCSV(data, vin);
    await generateJSON(data, vin);
  }
};
