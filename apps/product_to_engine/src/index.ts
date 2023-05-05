import { findDuplicates } from "@ag-crawler/utils";
import dayjs from "dayjs";
import minimist from "minimist";
import { chromium } from "playwright";

import { products } from "./config";
import { getModels } from "./get_models";
import { parseEngineProduct } from "./parse_engine_product";

export interface IArgs {
  headless?: string;
}

const main = async () => {
  try {
    const response = await fetch("https://api.gtnjob.tk/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "bilguun@889@gmail.com",
        password_hash: "123123123123123",
      }),
    });
    console.log("response", response);
  } catch (error) {
    console.log("error", error);
  }
  // const { headless } = minimist(process.argv.slice(2)) as IArgs;
  // if (products.length === 0) {
  //   throw Error("NO PRODUCTS");
  // } else if (products) {
  //   const duplicates = findDuplicates(products);

  //   if (duplicates.length > 0) {
  //     throw Error(`DUPLICATE PRODUCTS: ${JSON.stringify(duplicates)}`);
  //   }
  // }

  // const browser = await chromium.launch({ headless: !(headless === "false") });
  // const page = await browser.newPage();

  // const parsed = await parseEngineProduct();
  // const startedAt = dayjs().format("YYYY-MM-DDTHH_mm_ss");
  // for (const product of products) {
  //   console.log(`PRODUCT: ${products.indexOf(product) + 1}/${products.length}`);
  //   await getModels(page, product, parsed, startedAt);
  // }

  // await browser.close();
};

main().catch((error) => {
  const _error = error as Error;
  console.log(_error.message);
});
