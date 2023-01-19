import dayjs from "dayjs";
import { writeFile } from "fs/promises";
import { join } from "path";

import { ICategory, ISubCategory } from "types";

export const generateCSV = async (
  data: Record<string, ICategory<Record<string, ISubCategory>>>,
  vin: string
) => {
  const csv: string[] = ["VIN,CATEGORY,SUBCATEGORY,PARTCODE,PART,CODE"];
  for (const categoryName of Object.keys(data)) {
    const category = data[categoryName];

    for (const subCategoryName of Object.keys(category.children)) {
      const subCategory = category.children[subCategoryName];

      for (const part of subCategory.children) {
        const partCode = part.code;
        const partName = part.name;

        for (const [_, { code }] of (part.children ?? []).entries()) {
          csv.push(
            `${vin},${`"${categoryName}"`},${`"${subCategoryName}"`},${partCode},${`"${partName}"`},${`"${code}"`}`
          );
        }
      }
    }
  }

  const dirName = process.cwd();

  const fileName = `./${vin}#${dayjs().format("YYYY-MM-DDTHH:mm:ss")}.csv`;
  await writeFile(join(dirName, fileName), csv.join("\n"));
};
