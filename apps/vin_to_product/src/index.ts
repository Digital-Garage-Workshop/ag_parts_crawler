import { findDuplicates } from "@ag-crawler/utils";
import minimist from "minimist";
import { chromium } from "playwright";

import { vehicles } from "./config";
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

  const browser = await chromium.launch({ headless: !(headless === "false") });
  const page = await browser.newPage();

  for (const vehicle of vehicles) {
    await getVehicle(page, vehicle, (vehicleProgress) => {
      console.log(
        `VEHICLE: ${vehicles.indexOf(vehicle) + 1}/${
          vehicles.length
        } ${vehicleProgress}`
      );
    });
  }

  await browser.close();
};

main().catch((error) => {
  const _error = error as Error;
  console.log(_error.message);
});
