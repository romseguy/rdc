import { Slider } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BackButton } from "~/components";
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
  const getRouter = () => ({
    getCurrentLocation: () => ({ url: "note" }),
    navigate,
    navigateByName: () => {},
  });
  const [value, setValue] = useState(95);
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
                getRouter().navigate(-1);
              }}
            />

            <h1>
              Citation p.{note.page}{" "}
              {book?.title ? (
                <>
                  du livre : <i>{book?.title}</i>
                </>
              ) : (
                <>
                  du {book?.id === 1 ? "premier" : book?.id + "ème"} livre de la
                  bibliothèque : <i>{lib?.name}</i>
                </>
              )}
            </h1>
          </div>

          <main style={{ maxWidth: value + "em", margin: "0 auto" }}>
            {isLoaded && (
              <Slider
                defaultValue={[100]}
                min={20}
                max={95}
                step={1}
                className="w-[60%]"
                onValueChange={(v) => {
                  setValue(v[0]);
                }}
              />
            )}

            <div dangerouslySetInnerHTML={{ __html: note.desc }} />
          </main>
        </>
      )}
    </>
  );
};
