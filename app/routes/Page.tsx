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
import { Theme } from "@radix-ui/themes";
import type { ThemeOwnProps } from "@radix-ui/themes/components/theme.props";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "react-router";
import { Flex, ToastsContainer } from "~/components";
import { Header } from "~/components/Header";
import { PageTitle } from "~/components/PageTitle";
import { SpinnerOverlay } from "~/components/SpinnerOverlay";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { getState, setState } from "~/store";
import { i18n, length, toggleCss } from "~/utils";
import { Modal, useToggleModal } from "./Modal";

const Page = (props) => {
  //#region state
  const { element, loaderData, noTheme, simple } = props;
  const state = useSelector(getState);
  const { auth, isMobile, locale, modal, toast } = state;
  const user = auth?.user;
  const [appearance, setAppearance] = useStorage("color-mode", {
    type: "local",
    defaultValue: "dark",
  });
  let [authToken, setAuthToken] = useStorage(tokenKey, {
    type: "local",
  });
  //#endregion

  //#region hooks
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toggleModal = useToggleModal();
  useEffect(() => {
    if (navigation.state === "idle" && !length(state.collections))
      dispatch(
        setState({
          collections: loaderData.collections,
        }),
      );
  }, [navigation.state, loaderData.collections]);
  useEffect(() => {
    if (navigation.state === "idle" && !length(state.libs))
      dispatch(setState({ libs: loaderData.libs }));
  }, [navigation.state, loaderData.libs]);
  useEffect(() => {
    if (navigation.state === "idle" && !length(state.lib))
      dispatch(setState({ lib: loaderData.lib }));
  }, [navigation.state, loaderData.lib]);
  useEffect(() => {
    if (!authToken && process.env.NODE_ENV === "development") {
      authToken = import.meta.env.VITE_PUBLIC_AUTH_TOKEN;
    }
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
  }, [authToken]);
  useEffect(() => {
    if (!auth) setAuthToken(undefined);
  }, [auth]);
  //#endregion

  //#region ui
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

      {!modal.isOpen && navigation.state === "idle" && (
        <div id="page">
          <header>
            <PageTitle />
            <Header {...childProps} />
          </header>

          {React.createElement(element, childProps)}

          {toggleButtonsLeft}
          {toggleButtonsRight}
        </div>
      )}

      {navigation.state === "loading" && <SpinnerOverlay />}
    </Theme>
  );
};

export default Page;
