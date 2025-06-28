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
import {
  Flex,
  ToastsContainer,
  Config,
  Header,
  Modal,
  PageTitle,
  SpinnerOverlay,
  useToggleModal,
} from "~/components";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { getState, setState } from "~/store";
import { length, toggleCss } from "~/utils";

const Page = (props) => {
  //#region state
  const { element, loaderData, noTheme, simple } = props;
  const state = useSelector(getState);
  const { auth, locale, modal, toast } = state;
  const user = auth?.user;
  const [appearance, setAppearance] = useStorage("color-mode", {
    type: "local",
    defaultValue: "dark",
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
    if (navigation.state === "idle") {
      dispatch(setState({ locale }));
    }
  }, [navigation.state, locale]);
  useEffect(() => {
    let bearer = "";
    if (localStorage.getItem(tokenKey)) {
      bearer = localStorage.getItem(tokenKey) || "";
    } else if (process.env.NODE_ENV === "development") {
      bearer = import.meta.env.VITE_PUBLIC_AUTH_TOKEN;
    }
    if (bearer) {
      localStorage.setItem(tokenKey, bearer);
    }
    const { user, ...token } = bearer ? JSON.parse(bearer) : {};
    dispatch(
      setState({
        isLoaded: true,
        isMobile: props.loaderData.isMobile,
        locale,
        auth: { bearer, token, user },
      }),
    );
  }, []);
  //#endregion

  //#region ui
  const onToastFinished = (id) => {
    dispatch(setState({ toast: undefined }));
  };
  const childProps = {
    ...props,
    ...{ loaderData }, // ssr
    ...{
      appearance,
      setAppearance,
    },
  };
  //#endregion

  const toggleButtonsRight = (
    <div style={{ position: "fixed", bottom: 12, right: 12, zIndex: 999 }}>
      <Flex gap="2">
        <Toggle
          css={css(toggleCss(appearance))}
          onPressedChange={() => {
            toggleModal("heart-modal");
          }}
        >
          <HeartIcon />
        </Toggle>
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

  if (noTheme)
    return <div id="page">{React.createElement(element, childProps)}</div>;

  if (simple)
    return (
      <Theme appearance={appearance as ThemeOwnProps["appearance"]}>
        <Config />
        <ToastsContainer toast={toast} onToastFinished={onToastFinished} />
        {modal.isOpen && <Modal {...childProps} />}

        {!modal.isOpen && (
          <div id="page">{React.createElement(element, childProps)}</div>
        )}

        {navigation.state === "loading" && <SpinnerOverlay />}

        {toggleButtonsRight}
      </Theme>
    );

  return (
    <Theme appearance={appearance as ThemeOwnProps["appearance"]}>
      <Config />
      <ToastsContainer toast={toast} onToastFinished={onToastFinished} />
      {modal.isOpen && <Modal {...childProps} />}

      {!modal.isOpen && navigation.state === "idle" && (
        <div id="page">
          <header>
            <PageTitle {...childProps} />
            <Header {...childProps} />
          </header>

          {React.createElement(element, childProps)}

          {toggleButtonsRight}
        </div>
      )}

      {navigation.state === "loading" && <SpinnerOverlay />}
    </Theme>
  );
};

export default Page;
