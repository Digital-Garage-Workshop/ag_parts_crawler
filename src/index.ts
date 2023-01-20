import minimist from "minimist";
import { chromium } from "playwright";

import { vehicles } from "./config";
import { getVehicle } from "./get_vehicle.js";

export interface IArgs {
  headless?: string;
}

const main = async () => {
  const { headless } = minimist(process.argv.slice(2)) as IArgs;
  if (vehicles.length === 0) {
    throw Error("NO VEHICLES");
  }

  const browser = await chromium.launch({ headless: !(headless === "false") });
  const page = await browser.newPage();

  for (const { vin } of vehicles) {
    await getVehicle(page, vin, (vehicleProgress) => {
      console.log(
        `VEHICLE: ${vehicles.map(({ vin }) => vin).indexOf(vin) + 1}/${
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
