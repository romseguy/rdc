export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type User = { email: string };
export type Note = { desc: string; desc_en?: string };
export type Book = {
  id: string;
  title?: string;
  notes?: Note[];
  src?: string;
};
export type Lib = {
  id: string;
  name: string;
  books: PartialBy<Book, "id">[];
};
