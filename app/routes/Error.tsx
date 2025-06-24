import { Theme } from "@radix-ui/themes";
import { ThemeOwnProps } from "@radix-ui/themes/components/theme.props";
import { useSelector } from "react-redux";
import {
  MailTo,
  MailToTrigger,
  MailToBody,
  BackButton,
  Flex,
} from "~/components";
import { getState } from "~/store";
import { localize } from "~/utils";

export const Error = ({ message, details, stack }) => {
  const { appearance, screenWidth } = useSelector(getState);

  return (
    <Theme appearance={appearance as ThemeOwnProps["appearance"]}>
      <div id="page">
        <div id="error-page">
          <Flex
            direction="column"
            justify="center"
            style={{ maxWidth: screenWidth + "px", minHeight: "100%" }}
          >
            <Flex>
              <BackButton />
              <h1>{message}</h1>
            </Flex>
            <p>{details}.</p>
            {message !== "404" && (
              <MailTo
                to={import.meta.env.VITE_PUBLIC_EMAIL}
                subject="Rapport d'erreur"
                //cc={["cc1@example.com", "cc2@example.com"]}
                //bcc={["bcc@example.com"]}
                obfuscate
              >
                <MailToTrigger>
                  {localize(
                    "Envoyer un message pour m'aider à améliorer le site",
                    "Send a message to help me improve the website",
                  )}
                </MailToTrigger>
                <MailToBody>
                  -{" "}
                  {localize(
                    "Décrivez ci-dessous ce qui vous a fait rencontrer une erreur",
                    "Describe below how you reached an error",
                  )}{" "}
                  :
                  <br />
                  <br />
                  {localize(
                    "J'ai cliqué sur la couverture d'un livre",
                    "I clicked on a book cover",
                  )}
                  <br />
                  <br />
                  <br />
                  <br />- {localize("Détails de l'erreur", "Error details")} :
                  <br />
                  <br />
                  {details}
                  <br />
                  <br />
                  {stack}
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
          </Flex>
        </div>
      </div>
    </Theme>
  );
};
