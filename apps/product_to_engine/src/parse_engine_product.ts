//
import { readFile } from "fs/promises";

//
import { engineProduct } from "./config";
export const parseEngineProduct = async () => {
  try {
    const data: Record<string, string> = {};

    const content = await readFile(engineProduct, "utf-8");
    for (const item of content.split(/\r?\n/)) {
      const [vin, code] = item.split(",");
      if (vin && code) {
        data[vin] = code;
      }
    }

    return data;
  } catch (error) {
    console.log(error);
    return {};
  }
};
