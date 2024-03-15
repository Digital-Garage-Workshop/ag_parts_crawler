import { INissanVehicleDetails } from "@ag-crawler/types";
import dayjs from "dayjs";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";

export const generateCSV = async (data: INissanVehicleDetails[]) => {
  const csvHeader = "VIN,ENGINE,OPTIONS";
  const csv: string[] = data.map(
    ({ vin, engine, options }) => `${vin},${`${engine}`},${`${options}`}`
  );

  const filePath = `./files/${dayjs().format("YYYY-MM-DDTHH_mm_ss")}.csv`;
  if (!existsSync("./files")) {
    mkdirSync("./files");
  }
  await writeFile(filePath, [csvHeader].concat(csv).join("\n"));
};
