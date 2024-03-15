import { IToyotaVehicleDetails } from "@ag-crawler/types";
import type { Page } from "playwright";

export const getData = async (
  page: Page,
  vin: string
): Promise<Omit<IToyotaVehicleDetails, "vin"> | null> => {
  try {
    // generic
    const date = await getGenericField(page, "wYR");
    const maker = await getGenericField(page, "wMK");
    const model = await getGenericField(page, "wMD");

    // response
    const modelCode = await getResponseField(page, 2);
    const from = await getResponseField(page, 3, (text) =>
      text.replace(" -", "")
    );
    const to = await getResponseField(page, 4);
    const frame = await getResponseField(page, 5);

    // characteristics
    const destination = await getCharacteristic(page, "DESTINATION");
    const body = await getCharacteristic(page, "BODY");
    const driver = await getCharacteristic(page, "DRIVER\\'S POSITION");
    const engine = await getCharacteristic(page, "ENGINE");
    const fuel = await getCharacteristic(page, "FUEL SYSTEM");
    const transmission = await getCharacteristic(page, "TRANSMISSION");
    const color = await getCharacteristic(page, "COLOR CODE");
    const trim = await getCharacteristic(page, "TRIM CODE");

    return {
      maker,
      model,
      modelCode,
      frame,
      date,
      from,
      to,
      destination,
      body,
      driver,
      engine,
      fuel,
      transmission,
      color,
      trim,
    };
  } catch (error) {
    console.error(`Unknown error: ${vin}`);
    console.error(error instanceof Error ? error.message : error);

    return null;
  }
};

const getGenericField = async (page: Page, value: string) => {
  return await page
    .locator(`#${value} a`)
    .all()
    .then((result) => result.find(Boolean)?.innerText() ?? "");
};
const getResponseField = async (
  page: Page,
  value: number,
  replace?: (text: string) => string
) => {
  const response = await page
    .locator(".res tr:nth-child(2)")
    .all()
    .then((result) => result.find(Boolean));
  if (!response) {
    return "";
  }

  return await response
    .locator(`td:nth-child(${value})`)
    .all()
    .then((result) => result.find(Boolean)?.innerText() ?? "")
    .then(replace);
};
const getCharacteristic = async (page: Page, value: string) => {
  return await page
    .locator(`.t2 tr:has-text('${value}:') td:nth-child(2)`)
    .all()
    .then((result) => result.find(Boolean)?.innerText() ?? "")
    .then((text) => text.replace(":", ""));
};
