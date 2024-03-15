import dayjs from "dayjs";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";

import { ICategory, ISubCategory } from "@ag-crawler/types";

export const generateJSON = async (
  data: Record<string, ICategory<Record<string, ISubCategory>>>,
  vin: string
) => {
  const fileName = `./files/${vin}#${dayjs().format(
    "YYYY-MM-DDTHH_mm_ss"
  )}.json`;
  if (!existsSync("./files")) {
    mkdirSync("./files");
  }
  await writeFile(fileName, JSON.stringify(data));
};
