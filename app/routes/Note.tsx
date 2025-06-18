import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Slider } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BackButton, Flex } from "~/components";

export const Note = (props) => {
  const {
    loaderData: { lib, book, note },
    screenWidth,
  } = props;
  const navigate = useNavigate();

  //const [isDark, setIsDark] = useState(true);
  const [lineHeight, setLineHeight] = useState(2);
  const [size, setSize] = useState(16);
  const defaultWidth = screenWidth > 1000 ? 1000 : screenWidth;
  const [width, setWidth] = useState(defaultWidth);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div id="note-page">
      <header>
        <Flex p="3">
          <BackButton style={{ marginRight: "6px" }} />

          <h2>
            Citation {note.page && `p.${note.page} `}
            {book?.title ? (
              <>
                {book.is_conf && (
                  <>
                    de la conférence :{" "}
                    <i>
                      {book.title} ({lib.name})
                    </i>
                  </>
                )}
                {!book.is_conf && (
                  <>
                    du livre :{" "}
                    <i>
                      {book?.title} ({lib.name})
                    </i>
                  </>
                )}
              </>
            ) : (
              <>
                du {book?.id === 1 ? "premier" : book?.id + "ème"} livre de la
                bibliothèque : <i>{lib?.name}</i>
              </>
            )}
          </h2>
        </Flex>

        {/* sliders */}
        <Flex
          direction="column"
          align="start"
          gap="3"
          style={{
            // borderBottom: "1px solid white",
            // borderTop: "1px solid white",
            padding: "12px",
            paddingTop: "0",
          }}
        >
          {/* <Button className="with-icon" onClick={() => setIsDark(!isDark)}>
              {isDark ? (
                <>
                  <SunIcon />
                  Utiliser le thème clair
                </>
              ) : (
                <>
                  <MoonIcon />
                  Utiliser le thème sombre
                </>
              )}
            </Button> */}

          <Flex>
            <InfoCircledIcon stroke="lightblue" />
            Taille du texte
          </Flex>
          {isLoaded && (
            <Slider
              defaultValue={[16]}
              min={6}
              max={72}
              step={1}
              onValueChange={(v) => {
                setSize(v[0]);
              }}
            />
          )}

          <Flex>
            <InfoCircledIcon stroke="lightblue" />
            Largeur du texte
          </Flex>
          {isLoaded && (
            <Slider
              defaultValue={[defaultWidth]}
              min={defaultWidth / 3}
              max={defaultWidth}
              step={1}
              onValueChange={(v) => {
                setWidth(v[0]);
              }}
            />
          )}

          <Flex>
            <InfoCircledIcon stroke="lightblue" />
            Espace entre les lignes
          </Flex>
          {isLoaded && (
            <Slider
              defaultValue={[2]}
              min={0.1}
              max={10}
              step={0.1}
              onValueChange={(v) => {
                setLineHeight(v[0]);
              }}
            />
          )}
        </Flex>
      </header>

      <main
        style={{
          fontSize: size + "px",
          lineHeight,
          margin: "0 auto",
          width: width + "px",
          textAlign: "justify",
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: note.desc }} />
      </main>
    </div>
  );
};
