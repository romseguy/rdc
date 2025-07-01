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

const Page = (props) => {
  //#region state
  const { element, noTheme, simple } = props;
  const state = useSelector(getState);
  const { appearance, isMobile, modal, toast } = state;
  //#endregion

  //#region hooks
  const dispatch = useDispatch<any>();
  const navigation = useNavigation();
  //#endregion

  //#region ui
  const onToastFinished = (id) => {
    dispatch(setState({ toast: undefined }));
  };
  const childProps = { ...props };
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
