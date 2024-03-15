import { INissanVehicleDetails } from "@ag-crawler/types";
import type { Page } from "playwright";

export const getData = async (
  page: Page,
  vin: string
): Promise<Omit<INissanVehicleDetails, "vin"> | null> => {
  try {
    // characteristics
    const engine = await getCharacteristic(page, "Engine");
    const options = await getCharacteristic(page, "Options");

    return {
      engine,
      options,
    };
  } catch (error) {
    console.error(`Unknown error: ${vin}`);
    console.error(error instanceof Error ? error.message : error);

    return null;
  }
};

const getCharacteristic = async (page: Page, value: string) => {
  return await page
    .locator(
      `.epcVariation__details div:has-text('${value}:') span:nth-child(2)`
    )
    .all()
    .then((result) => result.find(Boolean)?.innerText() ?? "");
};
