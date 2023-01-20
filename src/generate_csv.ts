import dayjs from "dayjs";
import { writeFile } from "fs/promises";

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

  const fileName = `./files/${vin}#${dayjs().format(
    "YYYY-MM-DDTHH_mm_ss"
  )}.csv`;
  await writeFile(fileName, csv.join("\n"));
};
