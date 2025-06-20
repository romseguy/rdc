import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router";
import type { Route } from "../+types/root";
import { Page } from "~/routes/Page";
import { Error as ErrorPage } from "~/routes/Error";
import { useEffect, useState } from "react";
import { localize } from "~/utils";

export const ErrorBoundary = (props: Route.ErrorBoundaryProps) => {
  const routeError = useRouteError();
  const error = routeError || props.error;

  let message = localize("Erreur", "Error");
  let details = localize(
    "Une erreur inconnue est survenue",
    "An unknown error occured",
  );
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.statusText
      ? error.statusText
      : error.status === 404
      ? "La page demandée n'a pas pu être trouvée."
      : details;
  } else if (error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  if (!isLoaded) return null;

  return (
    <Page
      element={ErrorPage}
      simple
      message={message}
      details={details}
      stack={stack}
    />
  );
};
