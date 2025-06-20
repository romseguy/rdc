import type { Seed } from "./types";

export const seed: Seed[] = [
  {
    name: "L'Onde",
    name_en: "The Wave",
    author: "Laura Knight-Jadczyk",
    books: [
      {
        title: "L'Onde 1",
        title_en: "The Wave 1",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=141x10000:format=png/path/sd7739c2374e37db5/image/id624acc08d96ca45/version/1456401001/image.png",
        notes: [
          { page: 123, desc: "desc", desc_en: "en", note_email: "a@b.com" },
          { page: 12, desc: "test" },
        ],
      },
    ],
  },
  {
    name: "Evolutionary Psychology",
    author: "Bernard de Montréal",
    books: [],
  },
];
