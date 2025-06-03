import axios from "axios";
import https from "https";
import { useDebouncedCallback } from "@charlietango/hooks/use-debounced-callback";
import React, {
  StrictMode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import "./App.scss";
import SplitPane from "react-split-pane";

type Lib = {
  name: string;
  books: {
    title: string;
    src?: string;
    notes?: {
      desc: string;
    }[];
  }[];
};
const libs: Lib[] = [
  {
    name: "L'onde",
    books: [
      {
        title: "L'onde 1",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=141x10000:format=png/path/sd7739c2374e37db5/image/id624acc08d96ca45/version/1456401001/image.png",
        notes: [
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
          { desc: "Bonjour" },
        ],
      },
      {
        title: "L'onde 2",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=144x10000:format=png/path/sd7739c2374e37db5/image/i8178498c4ef29a55/version/1456401004/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 3",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=147x10000:format=png/path/sd7739c2374e37db5/image/i36668e68d2f5597e/version/1456401007/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 4",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=151x10000:format=png/path/sd7739c2374e37db5/image/i748f4eea536ae9dd/version/1456401010/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 5",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=139x10000:format=png/path/sd7739c2374e37db5/image/i10fdfe9c63199de1/version/1456401041/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 6",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=144x10000:format=png/path/sd7739c2374e37db5/image/if5623d4563d7c52c/version/1456401069/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 7",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=148x10000:format=png/path/sd7739c2374e37db5/image/i5faf04f8fa6b2fae/version/1456401098/image.png",
        notes: [{ desc: "Bonjour" }],
      },
      {
        title: "L'onde 8",
        src: "https://image.jimcdn.com/app/cms/image/transf/dimension=152x10000:format=png/path/sd7739c2374e37db5/image/id1247c1da4dfbf55/version/1456401115/image.png",
        notes: [{ desc: "Bonjour" }],
      },
    ],
  },
  {
    name: "BDM",
    books: [
      {
        title: "Psychologie évolutionnaire",
      },
    ],
  },
];

const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false,
});

const client = axios.create({
  responseType: "json",
  withCredentials: false,
  httpsAgent: agent,
  timeout: 60000,
});

function App() {
  const debouncedCallback = useDebouncedCallback(async () => {
    const { data } = await client.get(
      import.meta.env.VITE_PUBLIC_API || "http://localhost:3001/api",
    );
    console.log("🚀 ~ data:", data);
  }, 0);
  useEffect(() => {
    debouncedCallback();
  }, []);

  const [lib, _setLib] = useState<Lib>(libs[0]);
  console.log("🚀 ~ App ~ lib:", lib);
  const setLib = (libName: string) => {
    const l = libs.find((li) => li.name === libName);
    if (l) _setLib(l);
  };
  const [current, setCurrent] = useState<null | number>(null);
  const [book, setBook] = useState(
    current !== null ? lib.books[current] : null,
  );
  const notes = book?.notes;

  const rows = useMemo(() => {
    if (!notes) return [[]];
    let c = -1;
    let i = 0;
    let els = [];
    for (const note of notes) {
      const n = { ...note, index: i };
      if (i % 3 === 0) {
        els.push([n]);
        ++c;
      } else {
        els[c].push(n);
      }
      ++i;
    }
    return els;
  }, [notes]);
  const [currentNote, setCurrentNote] = useState<null | number>(null);
  console.log("🚀 ~ App ~ currentNote:", currentNote);

  if (book && currentNote !== null) {
    return (
      <div>
        <button onClick={() => setCurrentNote(null)}>Retour</button>
        <br />
        {book.notes[currentNote].desc}
        <br />
        <h1>Commentaires</h1>
      </div>
    );
  }

  return (
    <div className="Resizer ">
      <SplitPane
        style={{ position: "relative" }}
        split="horizontal"
        defaultSize={current === -1 || book ? 60 : 250}
        maxSize={250}
        //primary="second"
        pane1Style={{
          //height: "unset",
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          overflowX: current === -1 || book ? "hidden" : "scroll",
        }}
        pane2Style={
          {
            //margin: "0 " + window.innerHeight / 3 + "px",
            //overflowY: "scroll",
            //overflowX: "scroll",
            //maxHeight: window.innerHeight - 270 + "px"
          }
        }
      >
        {/* books */}
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {(book || current === -1) && (
              <div>
                <button
                  style={{ margin: "12px" }}
                  onClick={() => {
                    setCurrent(null);
                    setBook(null);
                  }}
                >
                  {"<"} Retour
                </button>
              </div>
            )}

            {book && (
              <div>
                Livre : <i>{book.title}</i>
              </div>
            )}

            {!book && current === -1 && (
              <div>
                Tous les livres de la bibliothèque <i>{lib.name}</i>
              </div>
            )}

            {!book && current !== -1 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid white",
                  height: "150px",
                  padding: "24px",
                  marginRight: "24px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setCurrent(-1);
                  setBook(null);
                }}
              >
                Tous les livres
              </div>
            )}

            {!book &&
              lib.books.map((book, index) => {
                if (current !== null && index !== current) return null;
                if (book.src)
                  return (
                    <img
                      key={"book-" + index}
                      src={book.src}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        if (current !== index) {
                          setCurrent(index);
                          setBook(lib.books[index]);
                        }
                      }}
                    />
                  );

                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      border: "1px solid white",
                      height: "150px",
                      padding: "24px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      if (current !== index) {
                        setCurrent(index);
                        setBook(lib.books[index]);
                      }
                    }}
                  >
                    {book.title}
                  </div>
                );
              })}
          </div>
        </div>

        {/* notes */}
        <div
          style={
            {
              //height: "100%"
            }
          }
        >
          {!book && current !== -1 && (
            <>
              Sélectionnez une bibliothèque :
              <ol>
                <li>
                  <a href="#" onClick={() => setLib("L'onde")}>
                    L'onde
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => setLib("BDM")}>
                    BDM
                  </a>
                </li>
              </ol>
            </>
          )}

          {(book || current === -1) && (
            <SplitPane
              style={{ position: "relative" }}
              split="horizontal"
              defaultSize={window.innerHeight - 125}
              maxSize={window.innerHeight - 60}
              //primary="second"
              pane1Style={{
                //height: "unset",
                //whiteSpace: "nowrap",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
              pane2Style={
                {
                  //margin: "0 " + window.innerHeight / 3 + "px",
                  //overflowY: "scroll",
                  //overflowX: "scroll",
                  //maxHeight: window.innerHeight - 270 + "px"
                }
              }
            >
              <div style={{ width: "100%", padding: "24px" }}>
                {current === -1 && (
                  <h1>
                    Notes de la bibliothèque <i>{lib.name}</i>
                  </h1>
                )}
                {book && (
                  <div style={{ textAlign: "center" }}>
                    <h1>
                      Notes du livre : <i>{book.title}</i>
                    </h1>
                  </div>
                )}
                {rows.map((row, index) => {
                  return (
                    <div
                      key={"row-" + index}
                      style={
                        {
                          //display: "flex"
                        }
                      }
                    >
                      {row.map((note, index) => {
                        return (
                          <div
                            style={{
                              paddingBottom: "12px",
                              //display: "flex",
                              //flexDirection: "column",
                            }}
                          >
                            <div style={{ background: "purple" }}>
                              <a href="#" onClick={() => setCurrentNote(index)}>
                                Ouvrir
                              </a>
                              <a href="#" onClick={() => setCurrentNote(index)}>
                                Modifier
                              </a>
                              <a href="#" onClick={() => setCurrentNote(index)}>
                                Supprimer
                              </a>
                            </div>
                            <div
                              key={"note-" + index}
                              style={{
                                background: "rgba(255,255,255,0.1)",
                                //height: "100%",
                                //height: "100px",
                                //overflowY: "scroll",
                                //overflowX: "hidden",
                                //width: "200px",
                                //textOverflow: "ellipsis",
                              }}
                            >
                              {note.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div>
                <button style={{ margin: "12px 0 0 12px" }}>
                  Ajouter une note
                </button>
              </div>
            </SplitPane>
          )}
        </div>
      </SplitPane>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// .map((note, index) => {
//   return (
//   );
// })}

{
  /*
import Responsive from "react-grid-layout";
const MyFirstGrid = ({ children }) => {
  // layout is an array of objects, see the demo for more complete usage
  const layout = [
    { i: "note-0", x: 0, y: 0, w: 1, h: 1, static: true },
    { i: "note-1", x: 1, y: 0, w: 1, h: 1, minW: 1, maxW: 3 },
    { i: "note-2", x: 2, y: 0, w: 1, h: 1 },
    { i: "note-3", x: 0, y: 1, w: 1, h: 1, static: false },
    { i: "note-4", x: 1, y: 1, w: 1, h: 1, minW: 1, maxW: 1 },
    { i: "note-5", x: 2, y: 1, w: 1, h: 1 },
    { i: "note-6", x: 2, y: 1, w: 1, h: 1 }
  ];
  const cols = Math.round(window.innerWidth / 150);
  const onC = useCallback(() => console.log("???"), []);
  return (
    <Responsive
      layout={layout}
      cols={3}
      //rowHeight={30}
      width={window.innerWidth / 2 - 50}
    >
      {children.map((child) => (
        <div
          key={"note-" + child.index}
          style={{
            background: "red",
            overflowY: "hidden"
          }}
        >
          <div onClick={onC}>{child.desc}</div>
        </div>
      ))}
    </Responsive>
  );
};
  */
}

{
  /* {[
              {
                index: 0,
                desc: "very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long very long",
              },
              { index: 1, desc: "baaaaaaaaaaaaaaaaaaaaaa" },
              { index: 2, desc: "c" },
              { index: 3, desc: "b" },
              { index: 4, desc: "c" },
              { index: 5, desc: "b" },
              { index: 6, desc: "c" },
            ].map((note, index) => {
              const Note = (
                <div
                  key={"note-" + index}
                  style={{
                    background: "red",
                    //height: "100px",
                    minHeight: `${window.innerHeight - 370}px`,
                    minWidth: "200px",
                    overflow: "hidden",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    console.log(index);
                    //onClick(index);
                  }}
                >
                  <Note note={note} index={index} />
                  {note.desc}
                </div>
              );
              return (
                <>
                  {index % 2 === 0 ? (
                    <div
                      style={{
                        display: "flex",
                        //minHeight: "150px",
                        //minWidth: "150px"
                        //margin: "0 auto"
                      }}
                    >
                      {Note}
                    </div>
                  ) : (
                    <div>{Note}</div>
                  )}
                </>
              );
            })} */
}
