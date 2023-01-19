import { ISubCategory } from "types";

export interface ICategory<T = ISubCategory[]> {
  href: string;
  name: string;
  children: T;
}
