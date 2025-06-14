import "@radix-ui/themes/styles.css";
import "./root.scss";
import { isbot } from "isbot";
import { Theme } from "@radix-ui/themes";
import type { Route } from "./+types/root";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
  useRoutes,
} from "react-router";
import { MailTo, MailToTrigger, MailToBody, BackButton } from "./components";
import Sitemap from "./components/Sitemap";
import { Home } from "~/routes/Home";
import { Page } from "~/routes/Page";
import { Livre } from "~/routes/Livre";
import { Note } from "~/routes/Note";
import {
  seed,
  type Lib,
  type Book,
  type Note as NoteT,
  client,
  type Seed,
} from "./utils";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Theme appearance="dark">{children}</Theme>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ ...props }) {
  const id = props.params["*"] || "";

  let out: { libs: Lib[]; lib: Lib | Seed; book?: Book; note?: NoteT } = {
    libs: seed.map((lib, i) => ({ ...lib, id: "" + i } as Lib)),
    lib: seed[0],
  };

  try {
    const { data } = await client.get();
    if (data.error) {
      out.libs = out.libs.map(({ books, ...lib }) => ({
        ...lib,
        books: books?.map(({ ...book }) => ({ ...book, src: undefined })),
      }));
    } else {
      out.libs = data.libraries.map((lib, i) => {
        return {
          ...lib,
          id: lib.id || i,
          books: data.books
            .filter((book) => book.library_id === lib.id)
            .map((book) => {
              return {
                ...book,
                notes: data.notes
                  ?.filter((note) => note.book_id === book.id)
                  .map((note) => {
                    return {
                      ...note,
                      comments: data.comments.filter(
                        (comment) => comment.note_id === note.id,
                      ),
                    };
                  }),
              };
            }),
        };
      });
    }

    if (id.includes("livre")) {
      const bookId = id.substring(6);
      for (const lib of out.libs) {
        for (const b of lib.books || []) {
          if (b.id === bookId) {
            out.book = b;
          }
        }
      }
    } else if (id.includes("note")) {
      const noteId = id.substring(5);
      out.note = data.notes.find((note) => note.id === noteId);
      out.book = data.books.find((book) => book.id === out.note?.book_id);
    }

    out.lib =
      out.libs.find((lib) => lib.id === out.book?.library_id) || out.libs[0];

    return out;
  } catch (error: any) {
    return out;
  }
}

export default function Root({ ...props }) {
  // const location = useLocation();
  if (isbot()) return <Sitemap {...props} />;

  return <Tree {...props} />;
}

const Tree = (props) => {
  return useRoutes([
    {
      path: "/",
      element: <Page element={Home} {...props} />,
    },
    {
      path: "livre/:id",
      element: <Page element={Livre} {...props} />,
    },
    { path: "note/:id", element: <Note {...props} /> },
  ]);
};

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const navigate = useNavigate();
  let message = "Erreur";
  let details = "Une erreur est survenue.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "La page demandée n'a pas pu être trouvée."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div
      id="error-page"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <BackButton
            label="Précédent"
            onClick={() => {
              navigate(-1);
            }}
          />
          <h1>{message}</h1>
        </div>
        <p>{details}</p>
        {message !== "404" && (
          <MailTo
            to={import.meta.env.VITE_PUBLIC_EMAIL}
            subject="Rapport d'erreur"
            //cc={["cc1@example.com", "cc2@example.com"]}
            //bcc={["bcc@example.com"]}
            obfuscate
          >
            <MailToTrigger>
              Envoyer un message pour m'aider à améliorer le site
            </MailToTrigger>
            <MailToBody>
              - Décrivez ci-dessous ce qui vous a fait rencontrer une erreur :
              <br />
              <br />
              J'ai cliqué sur la couverture d'un livre
              <br />
              <br />
              - Contenu de l'erreur :
              <br />
              <br />
              {message}
              <br />
              <br />
              - Détails de l'erreur :
              <br />
              <br />
              {message}
            </MailToBody>
          </MailTo>
        )}
        {stack && (
          <pre>
            <code style={{ fontSize: "x-small", whiteSpace: "break-spaces" }}>
              {stack}
            </code>
          </pre>
        )}
      </div>
    </div>
  );
}

/*
    *{
      if (
        error.message === "FORCE" ||
        error.code === "ENOTFOUND" ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("Network")
      ) {
        showToast("Vous êtes hors-ligne");
        const seeds = seed.map(({ books, ...fields }, i) => ({
          ...fields,
          id: i + 1,
          books: books?.map(({ src, notes, ...bookFields }, j) => {
            return {
              ...bookFields,
              id: j + 1,
              notes: notes?.map(({ ...noteFields }, k) => {
                return {
                  ...noteFields,
                  id: k + 1,
                };
              }),
            };
          }),
        }));
        setLibs(seeds as Lib[]);
        _setLib(seeds[0] as Lib);
      } else {
        //showToast(error.message, true);
        setLibs(seed as Lib[]);
        _setLib(seed[0] as Lib);
      }
    }/
  }
  */
