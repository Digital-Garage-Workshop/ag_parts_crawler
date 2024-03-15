import { IToyotaVehicleDetails } from "@ag-crawler/types";
import dayjs from "dayjs";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";

export const generateCSV = async (data: IToyotaVehicleDetails[]) => {
  const csvHeader =
    "VIN,MAKER,MODEL,MODELCODE,FRAME,DATE,FROM,TO,DESTINATION,BODY,DRIVER,ENGINE,FUEL,TRANSMISSION,COLOR,TRIM";
  const csv: string[] = data.map(
    ({
      vin,
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
    }) =>
      `${vin},${`${maker}`},${`${model}`},${`${modelCode}`},${`${frame}`},${`${date}`},${`${from}`},${`${to}`},${`${destination}`},${`${body}`},${`${driver}`},${`${engine}`},${`${fuel}`},${`${transmission}`},${`${color}`},${`${trim}`}`
  );

  const filePath = `./files/${dayjs().format("YYYY-MM-DDTHH_mm_ss")}.csv`;
  if (!existsSync("./files")) {
    mkdirSync("./files");
  }
  await writeFile(filePath, [csvHeader].concat(csv).join("\n"));
};
