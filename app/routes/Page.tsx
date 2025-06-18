import { useStorage } from "@charlietango/hooks/use-storage";
import { ArrowUpIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { Toggle } from "@radix-ui/react-toggle";
import { Button, Separator, Theme } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { useDeviceSelectors } from "react-device-detect";
import { useNavigate } from "react-router";
import {
  EnIcon,
  Flex,
  FrIcon,
  Header,
  LocaleSwitch,
  ToastsContainer,
} from "~/components";
import { pageTitleStyle, toggleCss } from "~/lib/css";
import { client, tokenKey } from "~/utils";
import type { Lib, ModalT, User } from "~/utils/types";
import { Modal } from "./Modal";
import { css } from "@emotion/react";
import { redirect } from "react-router";

const controller = new AbortController();
const signal = controller.signal;

export const Page = (props) => {
  const { element, loaderData = {}, noTheme, simple } = props;
  const [{ isMobile }] = useDeviceSelectors(loaderData.userAgent);
  const navigate = useNavigate();

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
  const [toasts, setToasts] = useState<any[]>([]);
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
  const [modalState, setModalState] = useState<ModalT>({
    isOpen: false,
    book: null,
    note: null,
  });
  const toggleModal = () =>
    setModalState({ ...modalState, isOpen: !modalState.isOpen });
  //#endregion

  //#region ui
  const [appearance, setAppearance] = useStorage("color-mode", {
    type: "local",
    defaultValue: "dark",
  });
  const [locale, setLocale] = useState(import.meta.env.VITE_PUBLIC_LOCALE);
  const localize = (fr, en) => {
    if (locale === "en") return en;
    return fr;
  };
  const variables = {
    email_label: localize("Adresse e-mail", "Email address"),
    password_label: localize("Mot de passe", "Password"),
    email_input_placeholder: localize(
      "Votre adresse e-mail",
      "Your email address",
    ),
    password_input_placeholder: localize("Votre mot de passe", "Your password"),
    button_label: localize("Connexion", "Login"),
    loading_button_label: localize("Chargement...", "Loading..."),
    //social_provider_text: localize("", ""),
    link_text: localize("link_text", ""),
  };
  const i18n = {
    sign_in: variables,
    sign_up: {
      ...variables,
      button_label: localize("Créer le compte", "Create account"),
      link_text: localize("Créer un compte", "Create a new account"),
      confirmation_text: localize("Confirmer", "Confirm"),
    },
    magic_link: {
      ...variables,
      link_text: localize("Envoyer un mail de connexion", "Send a login email"),
      button_label: localize(
        "Envoyer un mail de connexion",
        "Send a login email",
      ),
    },
    forgotten_password: {
      ...variables,
      button_label: localize(
        "Envoyer un mail de récupération de mot de passe",
        "Send a password recovery email",
      ),
      link_text: localize("Mot de passe oublié ?", "Forgotten password?"),
    },
  };
  const [screenWidth, setScreenWidth] = useState(1000);
  useEffect(() => {
    const updateScreenWidth = () => {
      const newScreenWidth = window.innerWidth - 16;
      if (newScreenWidth !== screenWidth) setScreenWidth(newScreenWidth);
    };

    updateScreenWidth();
    if (!isMobile) {
      window.addEventListener("resize", updateScreenWidth);
      signal.addEventListener("abort", () => {
        window.removeEventListener("resize", updateScreenWidth);
      });
    }

    return () => {
      if (!isMobile) controller.abort();
    };
  }, []);

  const toggleButtonsLeft = null;
  // (
  //   <div style={{ position: "fixed", bottom: 0, left: 0 }}>
  //     <Flex p="3" gap="2">
  //       <Toggle
  //         onPressedChange={(pressed) => {
  //           console.log("🚀 ~ Page ~ pressed:", pressed);
  //           window.location.replace(
  //             locale === "en"
  //               ? "https://recueildecitations.fr"
  //               : "https://knowmyquotes.com",
  //           );
  //         }}
  //       >
  //         {locale === "en" ? <FrIcon /> : <EnIcon />}
  //       </Toggle>
  //     </Flex>
  //   </div>
  // );
  const toggleButtonsRight = (
    <div style={{ position: "fixed", bottom: 0, right: 0 }}>
      <Flex p="3" gap="2">
        <Toggle
          css={css(toggleCss(appearance))}
          onPressedChange={() => {
            setAppearance(appearance === "dark" ? "light" : "dark");
          }}
        >
          {appearance === "dark" ? <SunIcon /> : <MoonIcon />}
        </Toggle>
        <Toggle
          css={css(toggleCss(appearance))}
          onPressedChange={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <ArrowUpIcon />
        </Toggle>
      </Flex>
    </div>
  );

  const pageTitle = (
    <Flex justify="between" pb="3" pr="1" pt="3">
      {!isMobile && (
        <Separator style={{ width: "120px", visibility: "hidden" }} />
      )}
      <h1 style={pageTitleStyle(isMobile)} onClick={() => navigate("/")}>
        <Flex>
          {localize("Recueil de citations", "Know my quotes")}
          <LocaleSwitch
            locale={locale}
            width="1em"
            height="1em"
            onClick={(e) => {
              window.location.replace(
                locale === "en"
                  ? "https://recueildecitations.fr"
                  : "https://knowmyquotes.com",
              );
            }}
          />
        </Flex>
      </h1>
      <Button
        className="with-icon"
        onClick={async (e) => {
          e.stopPropagation();

          if (user) {
            const ok = confirm("Êtes-vous sûr de vouloir vous déconnecter?");
            if (ok) {
              setAuthToken();
              setUser(undefined);
            }
          } else {
            toggleModal();
          }
        }}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 448 512"
          height="1em"
          width="1em"
        >
          <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
        </svg>
        {user ? <div>{user.email}</div> : localize("Connexion", "Login")}
      </Button>
    </Flex>
  );
  //#endregion

  //#region child
  const [lib, _setLib] = useState<Lib>();
  const setLib = (libName: string) => {
    const l = loaderData.libs?.find((li) => li.name === libName);
    if (l) _setLib(l);
  };
  const childProps = {
    ...props,
    ...{ loaderData },
    ...{
      isMobile,
      lib,
      setLib,
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
      toggleModal,
      // ui
      appearance,
      setAppearance,
      locale,
      setLocale,
      localize,
      i18n,
      screenWidth,
    },
  };
  //#endregion

  if (noTheme)
    return <div id="page">{React.createElement(element, childProps)}</div>;

  if (simple)
    return (
      <Theme appearance={appearance}>
        {toggleButtonsLeft}
        {toggleButtonsRight}
        <div id="page">{React.createElement(element, childProps)}</div>
      </Theme>
    );

  return (
    <>
      <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} />

      <Theme appearance={appearance}>
        <Modal {...childProps} />

        {!modalState.isOpen && (
          <div id="page">
            {toggleButtonsLeft}
            {toggleButtonsRight}

            <header>
              {pageTitle}

              <Header {...childProps} />
            </header>

            {React.createElement(element, childProps)}
          </div>
        )}
      </Theme>
    </>
  );
};
