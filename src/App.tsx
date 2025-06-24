import { css } from "@emotion/react";
import { MailTo, MailToBody, MailToTrigger } from "@slalombuild/react-mailto";
import { Route, Switch } from "navigo-react";
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import "./App.scss";
import { ToastsContainer } from "./Toast";

function App() {
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

  return (
    <>
      <ToastsContainer toasts={toasts} onToastFinished={onToastFinished} />

      <Switch>
        <Route path="/"></Route>

        <Route path="/note/:id" name="note"></Route>
      </Switch>
    </>
  );
}

const Fallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div
      css={css`
        padding: 0 12px;
      `}
    >
      <h1>Erreur !</h1>
      <p>
        <i>
          <b>
            <span style={{ color: "red" }}>{error.message}</span>
          </b>
        </i>
      </p>
      <p>
        <MailTo
          to={import.meta.env.VITE_PUBLIC_EMAIL}
          subject="Rapport d'erreur"
          //cc={["cc1@example.com", "cc2@example.com"]}
          //bcc={["bcc@example.com"]}
          obfuscate
        >
          <MailToTrigger>
            Envoyer un message pour m'aider à améliorer le site
          </MailToTrigger>
          <MailToBody>
            - Décrivez ci-dessous ce qui vous a fait rencontrer une erreur :
            <br />
            <br />
            J'ai cliqué sur la couverture d'un livre
            <br />
            <br />
            - Contenu de l'erreur :
            <br />
            <br />
            {error.message}
          </MailToBody>
        </MailTo>
      </p>
      <button
        onClick={() => {
          resetErrorBoundary();
        }}
      >
        {"<"} Retour
      </button>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary fallbackRender={Fallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
