import { css } from "@emotion/react";
import { Theme } from "@radix-ui/themes";
import { type ThemeOwnProps } from "@radix-ui/themes/components/theme.props";
import { useSelector } from "react-redux";
import {
  BackButton,
  Flex,
  MailTo,
  MailToBody,
  MailToTrigger,
} from "~/components";
import { getState } from "~/store";
import { linkButton, localize, toCssString } from "~/utils";

export const Error = ({ message, details, stack }) => {
  const { appearance, screenWidth } = useSelector(getState);

  return (
    <Theme appearance={appearance as ThemeOwnProps["appearance"]}>
      <div id="page">
        <div id="error-page">
          <Flex
            direction="column"
            justify="center"
            gap="3"
            style={{ maxWidth: screenWidth + "px", minHeight: "100%" }}
          >
            <Flex>
              <BackButton />
              <h1>{message}</h1>
            </Flex>

            {message !== "404" && (
              <div
                css={css`
                  a {
                    ${linkButton(
                      toCssString({
                        padding: "6px 12px",
                        borderRadius: "var(--radius-2)",
                        fontWeight: "normal",
                        fontSize: "14px",
                      }),
                    )}
                  }
                `}
              >
                <MailTo
                  to={import.meta.env.VITE_PUBLIC_EMAIL}
                  subject="Rapport d'erreur"
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
              </div>
            )}

            {details && <pre>{details}.</pre>}

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
