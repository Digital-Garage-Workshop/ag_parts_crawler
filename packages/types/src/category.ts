import { ISubCategory } from "./sub_category";

export interface ICategory<T = ISubCategory[]> {
  href: string;
  name: string;
  children: T;
}
