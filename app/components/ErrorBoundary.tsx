import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { isRouteErrorResponse, useRouteError } from "react-router";
import { Error as ErrorPage } from "~/routes/Error";
import { store } from "~/store";
import { localize } from "~/utils";
import { Route } from "../routes/+types/$";

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
    <Provider store={store()}>
      <ErrorPage message={message} details={details} stack={stack} />;
    </Provider>
  );
};
