import { SunIcon, InfoCircledIcon, MoonIcon } from "@radix-ui/react-icons";
import { Button, Slider, useThemeContext } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BackButton, Flex } from "~/components";
import { toCss } from "~/utils";
//import * as Slider from "@radix-ui/react-slider";
//import { Slider } from "~/components/ui/slider";
//import * as SliderPrimitive from "@radix-ui/react-slider";
//import "rc-slider/assets/index.css";
//const Slider = lazy(() => import("rc-slider"));

export const Note = (props) => {
  const {
    loaderData: { lib, book, note },
  } = props;
  const isDark = props.appearance === "dark";
  const navigate = useNavigate();

  //const [isDark, setIsDark] = useState(true);
  const [lineHeight, setLineHeight] = useState(2);
  const [size, setSize] = useState(16);
  const [width, setWidth] = useState(1000);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div id="note-page">
      {note === undefined && <>La citation n'a pas été trouvée.</>}
      {note && (
        <>
          <header>
            <Flex>
              <BackButton
                style={{ marginRight: "6px" }}
                onClick={() => {
                  navigate(-1);
                }}
              />

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
                    du {book?.id === 1 ? "premier" : book?.id + "ème"} livre de
                    la bibliothèque : <i>{lib?.name}</i>
                  </>
                )}
              </h2>
            </Flex>

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
                  defaultValue={[1000]}
                  min={300}
                  max={1000}
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
              ...(isDark ? {} : {}),
              ...{
                fontSize: size + "px",
                lineHeight: lineHeight,
                width: width + "px",
                margin: "0 auto",
              },
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: note.desc }} />
          </main>
        </>
      )}
    </div>
  );
};
