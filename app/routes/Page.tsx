import { useStorage } from "@charlietango/hooks/use-storage";
import { css } from "@emotion/react";
import {
  ArrowUpIcon,
  BellIcon,
  HeartIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Toggle } from "@radix-ui/react-toggle";
import { Button, Separator, Theme } from "@radix-ui/themes";
import type { ThemeOwnProps } from "@radix-ui/themes/components/theme.props";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useNavigation } from "react-router";
import {
  Flex,
  Header,
  LocaleSwitch,
  ToastsContainer,
  UserIcon,
} from "~/components";
import { SpinnerOverlay } from "~/components/SpinnerOverlay";
import { pageTitleStyle, toggleCss } from "~/lib/css";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { getState, setState } from "~/store";
import { i18n, localize, collections as offlineCollections } from "~/utils";
import { Modal, useToggleModal } from "./Modal";

export const Page = (props) => {
  const { element, loaderData = {}, noTheme, simple } = props;
  const state = useSelector(getState);
  const { auth, collections, isMobile, lib, locale, modal, toast } = state;
  const user = auth?.user;
  useEffect(() => {
    if (!collections)
      dispatch(
        setState({
          collections: loaderData.collections.error
            ? offlineCollections
            : loaderData.collections,
        }),
      );
  }, [loaderData.collections]);
  useEffect(() => {
    if (!lib) dispatch(setState({ lib: loaderData.lib }));
  }, [loaderData.lib]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const toggleModal = useToggleModal();

  //#region auth
  const [authToken, setAuthToken] = useStorage(tokenKey, {
    type: "local",
  });
  useEffect(() => {
    if (authToken) {
      const { user, ...token } = JSON.parse(authToken);
      dispatch(
        setState({
          auth: {
            user,
            token,
            bearer: authToken,
          },
        }),
      );
    }
    // else if (process.env.NODE_ENV !== "development")
    //   dispatch(
    //     setState({ user: { email: import.meta.env.VITE_PUBLIC_EMAIL2 } }),
    //   );
  }, [authToken]);
  //#endregion

  //#region ui
  const [appearance, setAppearance] = useStorage("color-mode", {
    type: "local",
    defaultValue: "dark",
  });

  const toggleButtonsLeft = null;
  // (
  //   <div style={{ position: "fixed", bottom: 0, left: 0 }}>
  //     <Flex p="3" gap="2">
  //       <Toggle
  //         onPressedChange={(pressed) => {
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
    <div style={{ position: "fixed", bottom: 12, right: 12, zIndex: 999 }}>
      <Flex gap="2">
        {process.env.NODE_ENV === "development" && (
          <Toggle
            css={css(toggleCss(appearance))}
            onPressedChange={() => {
              toggleModal("heart-modal");
            }}
          >
            <HeartIcon />
          </Toggle>
        )}
        <Toggle
          css={css(toggleCss(appearance))}
          onPressedChange={() => {
            toggleModal("notif-modal", {
              email: user?.email,
            });
          }}
        >
          <BellIcon />
        </Toggle>
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
        <Separator style={{ width: "80px", visibility: "hidden" }} />
      )}
      <h1
        style={pageTitleStyle(isMobile)}
        onClick={() => {
          console.log("navigating to /");
          navigate("/");
        }}
      >
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
              dispatch(setState({ auth: undefined }));
            }
          } else {
            toggleModal();
          }
        }}
      >
        <UserIcon />
        {user ? <div>{user.email}</div> : localize("Connexion", "Login")}
      </Button>
    </Flex>
  );
  const onToastFinished = (id) => {
    dispatch(setState({ toast: undefined }));
  };
  //#endregion

  //#region child
  // const [lib, _setLib] = useState<Lib>();
  // const setLib = (libName: string) => {
  //   const l = loaderData.libs?.find((li) => li.name === libName);
  //   if (l) _setLib(l);
  // };
  const childProps = {
    ...props,
    ...{ loaderData },
    ...{
      // lib,
      // setLib,
      appearance,
      setAppearance,
      i18n,
    },
  };
  //#endregion

  if (noTheme)
    return <div id="page">{React.createElement(element, childProps)}</div>;

  if (simple)
    return (
      <Theme appearance={appearance as ThemeOwnProps["appearance"]}>
        <ToastsContainer toast={toast} onToastFinished={onToastFinished} />
        {modal.isOpen && <Modal {...childProps} />}

        {!modal.isOpen && (
          <div id="page">{React.createElement(element, childProps)}</div>
        )}

        {navigation.state === "loading" && <SpinnerOverlay />}

        {toggleButtonsLeft}
        {toggleButtonsRight}
      </Theme>
    );

  return (
    <Theme appearance={appearance as ThemeOwnProps["appearance"]}>
      <ToastsContainer toast={toast} onToastFinished={onToastFinished} />
      {modal.isOpen && <Modal {...childProps} />}

      {!modal.isOpen && (
        <div id="page">
          <header>
            {pageTitle}

            <Header {...childProps} />
          </header>

          {React.createElement(element, childProps)}
        </div>
      )}

      {navigation.state === "loading" && <SpinnerOverlay />}

      {toggleButtonsLeft}
      {toggleButtonsRight}
    </Theme>
  );
};
