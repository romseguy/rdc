export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type User = { email: string };
export enum ENoteOrder {
  ID = "ID",
  PAGE = "PAGE",
}
// export const NoteOrder = {
//   ID: EOrder.ID,
//   PAGE: EOrder.PAGE,
// };
export type Comment = {
  id: string;
  html: string;
  comment_email: string;
  created_at: string;
};
export type NoteT = Note & {
  isEditing?: boolean;
  isNew?: boolean;
  index?: number;
};
export type Note = {
  id: string;
  desc: string;
  desc_en?: string;
  page?: number;
  book_id: string;
  note_email?: string;
  comments?: Comment[];
};
export type BookT = Omit<Book, "notes"> & { notes?: NoteT[] };
export type Book = {
  id: string;
  title?: string;
  notes?: Note[];
  src?: string;
  library_id?: string;
  is_conf?: boolean;
};
export type Lib = {
  id: string;
  name: string;
  author: string;
  author_url?: string;
  books?: Book[];
};

type SeedNote = Omit<Note, "id" | "book_id"> & { id?: string };
type SeedBook = Omit<Book, "notes" | "id"> & {
  notes?: SeedNote[];
};
export type Seed = Omit<Lib, "id" | "books"> & {
  id?: string;
  books: SeedBook[];
};

export type RootData = {
  libs: Lib[];
  lib: Lib;
  is404: boolean;
};
