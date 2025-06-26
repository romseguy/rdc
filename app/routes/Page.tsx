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
  Config,
  Flex,
  Modal,
  PageTitle,
  SpinnerOverlay,
  ToastsContainer,
  useToggleModal,
} from "~/components";
import { getState, setState } from "~/store";
import { i18n, length, toggleCss } from "~/utils";

const Page = (props) => {
  //#region state
  const { element, loaderData, noTheme, simple } = props;
  const state = useSelector(getState);
  const { auth, modal, toast } = state;
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
    if (navigation.state === "idle" && !length(state.stuff))
      dispatch(
        setState({
          stuff: loaderData.stuff,
        }),
      );
  }, [navigation.state, loaderData.stuff]);
  //#endregion

  //#region ui
  const toggleButtonsLeft = null;
  const toggleButtonsRight = (
    <div style={{ position: "fixed", bottom: 12, right: 12, zIndex: 999 }}>
      <Flex gap="2">
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
  const childProps = {
    ...props,
    ...{ loaderData },
    ...{
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
        <Config />
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
      <Config />
      <ToastsContainer toast={toast} onToastFinished={onToastFinished} />
      {modal.isOpen && <Modal {...childProps} />}

      {!modal.isOpen && navigation.state === "idle" && (
        <div id="page">
          <header>
            <PageTitle />
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
