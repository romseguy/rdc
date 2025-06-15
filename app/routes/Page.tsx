import { useStorage } from "@charlietango/hooks/use-storage";
import { Theme } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { FullScreen, Header, ToastsContainer } from "~/components";
import { Login } from "~/components/Login";
import { client, tokenKey } from "~/utils";
import type { Lib, User } from "~/utils/types";

export const Page = ({ ...props }) => {
  const { element, loaderData } = props;

  //#region auth
  const [authToken, setAuthToken] = useStorage(tokenKey, {
    type: "local",
  });
  const { access_token: accessToken, refresh_token: refreshToken } = authToken
    ? JSON.parse(authToken)
    : {};
  const [user, setUser] = useState<null | User>();
  useEffect(() => {
    (async () => {
      if (accessToken && refreshToken) {
        client.defaults.headers.common = { at: accessToken, rt: refreshToken };
        const { data: user } = await client.get("/login");
        setUser(user);
      }
    })();
  }, [accessToken, refreshToken]);
  //#endregion
  //#region toast
  const [toasts, setToasts] = useState([]);
  const showToast = (message: string, isError = false) => {
    const toast = {
      id: toasts.length,
      message: message,
      delay: 2500,
      isError,
    };
    setToasts([...toasts, toast].reverse());
  };
  const onToastFinished = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };
  //#endregion
  //#region modal
  const [modalState, setModalState] = useState({ isOpen: false });
  //#endregion

  const [appearance, setAppearance] = useState("dark");
  const [lib, _setLib] = useState<Lib>();
  const setLib = (libName: string) => {
    const l = loaderData.libs?.find((li) => li.name === libName);
    if (l) _setLib(l);
  };
  const childProps = {
    ...{ loaderData },
    ...{
      lib,
      setLib,
      appearance,
      setAppearance,
      // auth
      accessToken,
      refreshToken,
      setAuthToken,
      user,
      setUser,
      // toast
      showToast,
      // modal
      modalState,
      setModalState,
    },
  };

  return (
    <>
      <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} />

      <Theme appearance={appearance}>
        {modalState.isOpen && (
          <FullScreen direction="column">
            <Login
              authToken={authToken}
              setAuthToken={setAuthToken}
              modalState={modalState}
              setModalState={setModalState}
              showToast={showToast}
            />
          </FullScreen>
        )}

        {!modalState.isOpen && (
          <div id="page">
            <header>
              <Header {...childProps} />
            </header>

            <main style={{ maxWidth: "50em", margin: "0 auto" }}>
              {React.createElement(element, childProps)}
            </main>
          </div>
        )}
      </Theme>
    </>
  );
};

{
  /* {React.Children.map(children, (child) =>
        React.cloneElement(child, { showToast }),
      )} */
}
