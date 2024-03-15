import { IToyotaVehicleDetails } from "@ag-crawler/types";
import { findDuplicates } from "@ag-crawler/utils";
import dayjs from "dayjs";
import minimist from "minimist";
import { chromium } from "playwright";

import { chunking, timeout, vehicles } from "./config";
import { appendCSV } from "./append_csv";
import { getVehicle } from "./get_vehicle";

export interface IArgs {
  headless?: string;
}

const main = async () => {
  const { headless } = minimist(process.argv.slice(2)) as IArgs;
  if (vehicles.length === 0) {
    throw Error("NO VEHICLES");
  } else if (vehicles) {
    const duplicates = findDuplicates(vehicles);

    if (duplicates.length > 0) {
      throw Error(`DUPLICATE VEHICLES: ${JSON.stringify(duplicates)}`);
    }
  }

  const browser = await chromium.launch({
    headless: !(headless === "false"),
  });
  const page = await browser.newPage();

  const data: IToyotaVehicleDetails[] = [];

  const startedAt = dayjs().format("YYYY-MM-DDTHH_mm_ss");
  for (const vehicle of vehicles) {
    console.log(`VEHICLE: ${vehicles.indexOf(vehicle) + 1}/${vehicles.length}`);
    const _data = await getVehicle(page, vehicle);

    data.push(
      _data ?? {
        vin: vehicle,
        maker: "",
        model: "",
        modelCode: "",
        frame: "",
        date: "",
        from: "",
        to: "",
        destination: "",
        body: "",
        driver: "",
        engine: "",
        fuel: "",
        transmission: "",
        color: "",
        trim: "",
      }
    );

    if (data.length === chunking) {
      await appendCSV(data, startedAt);
      data.length = 0;
    }

    await page.waitForTimeout(timeout);
  }

  if (data.length !== 0) {
    await appendCSV(data, startedAt);
  }

  await browser.close();
};

main().catch((error) => {
  const _error = error as Error;
  console.log(_error.message);
  process.exit(1);
});
