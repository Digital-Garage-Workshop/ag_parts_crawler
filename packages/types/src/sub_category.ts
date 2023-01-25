import { IPart } from "./part";

export interface ISubCategory<T = IPart[]> {
  href: string;
  name: string;
  children: T;
}
