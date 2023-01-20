import dayjs from "dayjs";
import { writeFile } from "fs/promises";

import { ICategory, ISubCategory } from "types";

export const generateJSON = async (
  data: Record<string, ICategory<Record<string, ISubCategory>>>,
  vin: string
) => {
  const fileName = `./files/${vin}#${dayjs().format(
    "YYYY-MM-DDTHH_mm_ss"
  )}.json`;
  await writeFile(fileName, JSON.stringify(data));
};
