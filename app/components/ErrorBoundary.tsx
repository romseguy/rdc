import { isRouteErrorResponse, useNavigate } from "react-router";
import { MailTo, MailToTrigger, MailToBody, BackButton } from "~/components";
import type { Route } from "../+types/root";

export const ErrorBoundary = (props: Route.ErrorBoundaryProps) => {
  const { error } = props;
  const navigate = useNavigate();

  let message = "Erreur";
  let details = "Une erreur est survenue.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "La page demandée n'a pas pu être trouvée."
        : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div
      data-is-root-theme="true"
      data-accent-color="indigo"
      data-gray-color="slate"
      data-has-background="true"
      data-panel-background="translucent"
      data-radius="medium"
      data-scaling="100%"
      className="radix-themes dark"
    >
      <div
        id="error-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <BackButton
              label="Précédent"
              onClick={() => {
                navigate(-1);
              }}
            />
            <h1>{message}</h1>
          </div>
          <p>{details}</p>
          {message !== "404" && (
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
                {message}
                {details && (
                  <>
                    <br />
                    <br />
                    - Détails de l'erreur :
                    <br />
                    <br />
                    {details}
                  </>
                )}
              </MailToBody>
            </MailTo>
          )}
          {stack && (
            <pre>
              <code
                style={{
                  fontSize: "x-small",
                  whiteSpace: "break-spaces",
                }}
              >
                {stack}
              </code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
