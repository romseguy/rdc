import { css } from "@emotion/react";
import { Badge, Switch } from "@radix-ui/themes";
import { lazy, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackButton, EmailIcon, Flex, useToast } from "~/components";
//import { Login } from "~/components/Login";
import { Input } from "~/components/ui/input";
import { getState, setState } from "~/store";
import { localize } from "~/utils";
const Login = lazy(() => import("~/components/Login"));

export const Modal = (props) => {
  const { i18n } = props;
  const { stuff, modal } = useSelector(getState);
  const { id } = modal;
  const [email, setEmail] = useState<string>("");

  const showToast = useToast();
  const toggleModal = useToggleModal();

  if (id === "notif-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Flex direction="column" justify="center" gap="3">
            <h1>{localize("Vos", "Your")} notifications</h1>
            <Flex
              css={css`
                position: relative;
              `}
            >
              {!modal.email ? (
                <>
                  <Flex
                    css={css`
                      position: absolute;
                      top: 0;
                      left: 0;
                      width: 2.5em;
                      height: 2.5em;
                      font-size: 18px;
                      color: black;
                      svg {
                        flex-shrink: 0;
                        padding: 0 12px;
                      }
                    `}
                  >
                    <EmailIcon />
                  </Flex>
                  <Input
                    autoFocus
                    name="email"
                    type="email"
                    readOnly={!!modal.email}
                    value={email || modal.email || ""}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </>
              ) : (
                <>
                  {localize(
                    "Seront envoyées à votre adresse e-mail",
                    "Will be send to your email address",
                  )}{" "}
                  : <Badge>{modal.email}</Badge>
                </>
              )}
            </Flex>

            <h2>{localize("Fréquence", "Frequency")}</h2>
            <Flex>
              <label>{localize("Quotidienne", "Daily")}</label>
              <Switch
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    alert(
                      localize(
                        "Si vous souhaitez bénéficier de cette fonctionnalité, merci d'envoyer un mail à contact@romseguy.com pour me le faire savoir",
                        "If you want this functionality, please send an email to contact@romseguy.com to let me know",
                      ),
                    );
                  }
                }}
              />
            </Flex>

            <Flex>
              <label>{localize("Hebdomadaire", "Weekly")}</label>
              <Switch
                checked={false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    alert(
                      localize(
                        "Si vous souhaitez bénéficier de cette fonctionnalité, merci d'envoyer un mail à contact@romseguy.com pour me le faire savoir",
                        "If you want this functionality, please send an email to contact@romseguy.com to let me know",
                      ),
                    );
                  }
                }}
              />
            </Flex>

            <BackButton onClick={() => toggleModal(id)} />
          </Flex>
        </div>
      </div>
    );

  if (id === "login-modal")
    return (
      <div id="modal">
        <div id={id}>
          <Login showToast={showToast} toggleModal={toggleModal} i18n={i18n} />
        </div>
      </div>
    );

  return null;
};

export const useToggleModal = () => {
  const dispatch = useDispatch();
  const { modal } = useSelector(getState);
  return (id = "login-modal", props = {}) =>
    dispatch(
      setState({
        modal: {
          id,
          isOpen: !modal.isOpen,
          ...props,
        },
      }),
    );
};
