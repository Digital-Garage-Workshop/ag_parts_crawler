import dayjs from "dayjs";
import { writeFile } from "fs/promises";
import { join } from "path";

import { ICategory, ISubCategory } from "types";

export const generateJSON = async (
  data: Record<string, ICategory<Record<string, ISubCategory>>>,
  vin: string
) => {
  const dirName = process.cwd();
  const fileName = `${vin}#${dayjs().format("YYYY-MM-DDTHH:mm:ss")}.json`;
  await writeFile(join(dirName, fileName), JSON.stringify(data));
};
