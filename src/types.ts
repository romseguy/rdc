export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type User = { email: string };
export type Note = {
  id: string;
  desc: string;
  desc_en?: string;
  isEditing?: boolean;
  page?: number;
};
export type Book = {
  id: string;
  title?: string;
  notes?: Note[];
  src?: string;
  page?: string;
};
export type Lib = {
  id: string;
  name: string;
  author: string;
  books?: Book[];
};

type SeedNote = Omit<Note, "id"> & { id?: string };
type SeedBook = Omit<Book, "notes" | "id"> & {
  notes?: SeedNote[];
};
export type Seed = Omit<Lib, "id" | "books"> & {
  id?: string;
  books: SeedBook[];
};
