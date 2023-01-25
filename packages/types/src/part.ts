export interface IPart {
  code: string;
  name: string;
  children?: IPart[];
}
