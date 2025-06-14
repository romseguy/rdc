import { SunIcon, InfoCircledIcon, MoonIcon } from "@radix-ui/react-icons";
import { Slider } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BackButton, Flex } from "~/components";
import { toCss } from "~/utils";
//import * as Slider from "@radix-ui/react-slider";
//import { Slider } from "~/components/ui/slider";
//import * as SliderPrimitive from "@radix-ui/react-slider";
//import "rc-slider/assets/index.css";
//const Slider = lazy(() => import("rc-slider"));

export const Note = ({ ...props }) => {
  // console.log("🚀 ~ Note ~ props:", props);
  const {
    loaderData: { lib, book, note },
  } = props;
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(true);
  const [lineHeight, setLineHeight] = useState(2);
  const [size, setSize] = useState(16);
  const [width, setWidth] = useState(50);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {note === undefined && <>La citation n'a pas été trouvée.</>}
      {note && (
        <>
          <div
            css={toCss({
              display: "flex",
              alignItems: "center",
              padding: "12px",
            })}
          >
            <BackButton
              style={{ marginRight: "6px" }}
              onClick={() => {
                navigate(-1);
              }}
            />

            <h1>
              Citation p.{note.page}{" "}
              {book?.title ? (
                <>
                  {book.is_conf && (
                    <>
                      de la conférence : <i>{lib.name}</i>
                    </>
                  )}
                  {!book.is_conf && (
                    <>
                      du livre : <i>{book?.title}</i>
                    </>
                  )}
                </>
              ) : (
                <>
                  du {book?.id === 1 ? "premier" : book?.id + "ème"} livre de la
                  bibliothèque : <i>{lib?.name}</i>
                </>
              )}
            </h1>
          </div>

          <Flex
            direction="column"
            align="start"
            gap="3"
            style={{
              // borderBottom: "1px solid white",
              // borderTop: "1px solid white",
              padding: "12px",
            }}
          >
            <button className="with-icon" onClick={() => setIsDark(!isDark)}>
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
            </button>

            <Flex>
              <InfoCircledIcon stroke="lightblue" />
              Taille du texte
            </Flex>
            {isLoaded && (
              <Slider
                defaultValue={[16]}
                min={1}
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
                defaultValue={[50]}
                min={20}
                max={95}
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

          <main
            style={{
              ...(isDark
                ? { color: "white", background: "rgba(0,0,0,0.6)" }
                : { color: "black", background: "rgba(255,255,255,0.8)" }),
              ...{
                fontSize: size + "px",
                lineHeight: lineHeight,
                maxWidth: width + "em",
                margin: "0 auto",
              },
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: note.desc }} />
          </main>
        </>
      )}
    </>
  );
};
