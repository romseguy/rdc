import { useNavigate } from "react-router";
import {
  MailTo,
  MailToTrigger,
  MailToBody,
  BackButton,
  Flex,
} from "~/components";

export const Error = ({ message, details, stack, screenWidth }) => {
  const navigate = useNavigate();

  return (
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
      </Flex>
    </div>
  );
};
