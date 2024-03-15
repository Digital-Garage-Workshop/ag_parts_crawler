import dayjs from "dayjs";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";

export const generateCSV = async (
  data: { vin: string; model: string; engine: string }[]
) => {
  const csv: string[] = ["VIN,MODEL,ENGINE"];
  for (const { vin, model, engine } of data) {
    csv.push(`${vin},${`${model}`},${`${engine}`}`);
  }

  const fileName = `./files/${dayjs().format("YYYY-MM-DDTHH_mm_ss")}.csv`;
  if (!existsSync("./files")) {
    mkdirSync("./files");
  }
  await writeFile(fileName, csv.join("\n"));
};
