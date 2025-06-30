import { Theme } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "react-router";
import {
  Config,
  PageHeader,
  Modal,
  PageTitle,
  SpinnerOverlay,
  ToastsContainer,
  ToggleButtonsRight,
} from "~/components";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { getState, setState } from "~/store";
import { length } from "~/utils";

const Page = (props) => {
  //#region state
  const { element, loaderData, noTheme, simple } = props;
  const state = useSelector(getState);
  const { appearance, isMobile, locale, modal, toast } = state;
  //#endregion

  //#region hooks
  const dispatch = useDispatch();
  const navigation = useNavigation();
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
    if (navigation.state === "idle" && !length(state.book))
      dispatch(setState({ book: loaderData.book }));
  }, [navigation.state, loaderData.book]);
  useEffect(() => {
    if (navigation.state === "idle") {
      dispatch(setState({ locale: props.locale }));
    }
  }, [navigation.state, props.locale]);
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
        auth: { bearer, token, user },
        isLoaded: true,
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
    //...{ loaderData },
  };
  //#endregion

  if (noTheme)
    return <div id="page">{React.createElement(element, childProps)}</div>;

  if (simple)
    return (
      <Theme appearance={appearance}>
        {navigation.state === "idle" && (
          <>
            <Config />
            <ToastsContainer toast={toast} onToastFinished={onToastFinished} />
            <ToggleButtonsRight />

            {modal.isOpen && <Modal {...childProps} />}

            {!modal.isOpen && (
              <div id="page">{React.createElement(element, childProps)}</div>
            )}
          </>
        )}

        {navigation.state === "loading" && <SpinnerOverlay />}
      </Theme>
    );

  return (
    <Theme
      className={isMobile ? "isMobile" : undefined}
      appearance={appearance}
    >
      {navigation.state === "idle" && (
        <>
          <Config />
          <ToastsContainer toast={toast} onToastFinished={onToastFinished} />
          {/* <ToggleButtonsLeft /> */}
          <ToggleButtonsRight />

          {modal.isOpen && <Modal {...childProps} />}

          {!modal.isOpen && (
            <div id="page">
              <PageTitle {...childProps} />
              <PageHeader {...childProps} />

              {React.createElement(element, childProps)}
            </div>
          )}
        </>
      )}

      {navigation.state === "loading" && <SpinnerOverlay />}
    </Theme>
  );
};

export default Page;
