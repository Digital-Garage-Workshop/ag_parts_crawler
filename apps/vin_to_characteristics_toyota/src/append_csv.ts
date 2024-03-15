import type { IToyotaVehicleDetails } from "@ag-crawler/types";
import { createReadStream, existsSync, mkdirSync } from "fs";
import { appendFile } from "fs/promises";
import { createInterface } from "readline";

export const appendCSV = async (
  data: IToyotaVehicleDetails[],
  startedAt: string
) => {
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

  if (!existsSync("./files")) {
    mkdirSync("./files");
  }
  const filePath = `./files/${startedAt}.csv`;
  const isFileExists = existsSync(filePath);
  const fileHeader =
    isFileExists && (await getFirstLine(filePath)) === csvHeader
      ? [""]
      : [csvHeader];

  await appendFile(filePath, fileHeader.concat(csv).join("\n"));
};

const getFirstLine = async (filePath: string) => {
  const readable = createReadStream(filePath);
  const reader = createInterface({ input: readable });
  const line = await new Promise<string>((resolve) => {
    reader.on("line", (line) => {
      reader.close();
      resolve(line);
    });
  });
  readable.close();

  return line;
};
