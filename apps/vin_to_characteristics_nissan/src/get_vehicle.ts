import { INissanVehicleDetails } from "@ag-crawler/types";
import type { Page } from "playwright";

import { getData } from "get_data";

import { baseUrl } from "./config";

export const getVehicle = async (
  page: Page,
  vin: string
): Promise<INissanVehicleDetails | null> => {
  try {
    await page.goto(`${baseUrl}`, {
      waitUntil: "load",
    });

    const form = await page
      .locator("#header-search-form")
      .all()
      .then((result) => result.find(Boolean));

    if (!form) {
      throw Error("NO_FORM_FOUND");
    }

    await form.locator(".search__input").fill(vin);
    await form.locator(".search__submit").click();
    await page.getByTitle("Go to main page").waitFor({ state: "visible" });

    // const warning = await page
    //   .getByText("Warning:")
    //   .all()
    //   .then((result) => result.find(Boolean)?.textContent())
    //   .then((result) =>
    //     result?.match(/\s\*\sWarning:.*/g)?.find((match) => match)
    //   );
    // if (warning) {
    //   console.error(`${warning}: ${vin}`);
    // }

    const noRecords = await page
      .getByText("Product not found")
      .all()
      .then((result) => result.find(Boolean));
    if (noRecords) {
      console.error(`Product not found: ${vin}`);
    }

    // const tooManyRecords = await page
    //   .getByText("Please narrow your search criteria")
    //   .all()
    //   .then((result) => result.find(Boolean));
    // if (tooManyRecords) {
    //   console.error(`Please narrow your search criteria: ${vin}`);
    // }

    const data = await getData(page, vin);
    if (!data) {
      return null;
    }

    return { vin, ...data };
  } catch (error) {
    console.error(`Unknown error: ${vin}`);
    console.error(error instanceof Error ? error.message : error);

    return null;
  }
};
