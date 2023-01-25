import { existsSync } from "fs";
import { appendFile } from "fs/promises";

export const generateCSV = async (
  data: { key: string; children: string[] }[],
  startedAt: string
) => {
  const csv: string[] = [];

  for (const { key, children } of data) {
    for (const child of children) {
      csv.push(`${`${child}`},${`${key}`}`);
    }
  }

  const fileName = `./files/${startedAt}.csv`;
  const isFileExists = existsSync(fileName);
  const fileHeader = isFileExists ? [] : ["ENGINE_ID,PRODUCT_ID"];

  await appendFile(fileName, fileHeader.concat(csv).join("\n"));
};
