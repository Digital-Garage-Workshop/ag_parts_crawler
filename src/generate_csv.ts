import dayjs from "dayjs";
import { writeFile } from "fs/promises";
import { join } from "path";

import { ICategory, ISubCategory } from "types";

export const generateCSV = async (
  data: Record<string, ICategory<Record<string, ISubCategory>>>,
  vin: string
) => {
  const csv: string[] = ["CATEGORY,SUBCATEGORY,PART,CODE"];
  for (const categoryName of Object.keys(data)) {
    const category = data[categoryName];

    for (const subCategoryName of Object.keys(category.children)) {
      const subCategory = category.children[subCategoryName];
      const subCategoryIndex = Object.keys(category.children).indexOf(
        subCategoryName
      );

      for (const part of subCategory.children) {
        const partName = part.name;
        const partIndex = subCategory.children.indexOf(part);

        for (const [childIndex, { code }] of (part.children ?? []).entries()) {
          csv.push(
            `${
              subCategoryIndex === 0 && partIndex === 0 && childIndex === 0
                ? `"${categoryName}"`
                : ""
            },${
              partIndex === 0 && childIndex === 0 ? `"${subCategoryName}"` : ""
            },${childIndex === 0 ? `"${partName}"` : ""},${`"${code}"`}`
          );
        }
      }
    }
  }

  const dirName = process.cwd();

  const fileName = `./${vin}#${dayjs().format("YYYY-MM-DDTHH:mm:ss")}.csv`;
  await writeFile(join(dirName, fileName), csv.join("\n"));
};
