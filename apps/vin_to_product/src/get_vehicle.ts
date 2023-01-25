import type { Page } from "playwright";
import produce from "immer";

import type { ICategory, ISubCategory } from "@ag-crawler/types";

import { baseUrl, timeout } from "./config";
import { generateCSV } from "./generate_csv";
import { generateJSON } from "./generate_json";
import { getCategories } from "./get_categories";
import { getParts } from "./get_parts";
import { getSubCategories } from "./get_subcategories";

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
    if ((await page.getByText("No records found").count()) > 0) {
      return;
    }

    await page.getByRole("link", { name: vin }).click();
    await page.waitForURL((url) =>
      url.href.endsWith(`${vin.toUpperCase()}.html`)
    );

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
    if (Object.keys(data).length > 0) {
      await generateCSV(data, vin);
      await generateJSON(data, vin);
    }
  }
};
