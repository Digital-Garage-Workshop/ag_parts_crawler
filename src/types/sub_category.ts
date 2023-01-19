import { IPart } from "types";

export interface ISubCategory<T = IPart[]> {
  href: string;
  name: string;
  children: T;
}
