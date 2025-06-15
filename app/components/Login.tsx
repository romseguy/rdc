import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { supabase } from "~/utils";
import { Flex } from "./Containers";
import { BackButton } from "./Controls";
import { Button } from "@radix-ui/themes";

const variables = {
  email_label: "Adresse e-mail",
  password_label: "Mot de passe",
  email_input_placeholder: "Votre adresse e-mail",
  password_input_placeholder: "Votre mot de passe",
  button_label: "Connexion",
  loading_button_label: "Chargement",
  //social_provider_text: "",
  link_text: "link_text",
};
const i18n = {
  sign_in: variables,
  sign_up: {
    ...variables,
    button_label: "Créer le compte",
    link_text: "Créer un compte",
    confirmation_text: "Confirmer",
  },
  magic_link: {
    ...variables,
    link_text: "Envoyer un mail de connexion",
    button_label: "Envoyer un mail de connexion",
  },
  forgotten_password: {
    ...variables,
    button_label: "Envoyer un mail de connexion",
    link_text: "Mot de passe oublié ?",
  },
};

function ForgottenPassword({
  setAuthView = (string) => {},
  supabaseClient,
  redirectTo,
  i18n,
  appearance,
  showLinks = false,
  showToast,
}) {
  const labels = i18n?.forgotten_password;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    if (error) showToast(error, true);
  }, [error]);
  useEffect(() => {
    if (message) showToast(message);
  }, [message]);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) setError(error.message);
    else setMessage(i18n?.forgotten_password?.confirmation_text as string);
    setLoading(false);
  };

  return (
    <form id="auth-forgot-password" onSubmit={handlePasswordReset}>
      <Flex direction="column" gap="3">
        <Flex direction="column" gap="3">
          <div>
            <label htmlFor="email">{labels?.email_label}</label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder={labels?.email_input_placeholder}
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button type="submit" color="primary" loading={loading}>
            {loading ? labels?.loading_button_label : labels?.button_label}
          </button>

          {showLinks && (
            <a
              href="#auth-sign-in"
              onClick={(e) => {
                e.preventDefault();
                setAuthView("sign_in");
              }}
            >
              {i18n?.sign_in?.link_text}
            </a>
          )}
        </Flex>
      </Flex>
    </form>
  );
}

function EmailAuth({
  authView = "sign_in",
  defaultEmail = "",
  defaultPassword = "",
  setAuthView = (string) => {},
  setDefaultEmail = (email) => {},
  setDefaultPassword = (password) => {},
  supabaseClient,
  showLinks = true,
  redirectTo,
  additionalData,
  magicLink = true,
  i18n,
  appearance,
  passwordLimit = false,
  showToast,
  onBackClick,
  onSuccess,
}) {
  const isMounted = useRef<boolean>(true);
  const labels = i18n?.[authView];
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  useEffect(() => {
    if (error) showToast(error, true);
  }, [error]);
  useEffect(() => {
    if (message) showToast(message);
  }, [message]);
  useEffect(() => {
    isMounted.current = true;
    setEmail(defaultEmail);
    setPassword(defaultPassword);

    return () => {
      isMounted.current = false;
    };
  }, [authView]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    switch (authView) {
      case "sign_in":
        const { error: signInError } =
          await supabaseClient.auth.signInWithPassword({
            email,
            password,
          });
        if (signInError) setError(signInError.message);
        else onSuccess();
        break;
      case "sign_up":
        if (passwordLimit && password.length > 72) {
          setError("Password exceeds maxmium length of 72 characters");
          return;
        }
        let options: { emailRedirectTo: string; data?: object } = {
          emailRedirectTo: redirectTo,
        };
        if (additionalData) {
          options.data = additionalData;
        }
        const {
          data: { user: signUpUser, session: signUpSession },
          error: signUpError,
        } = await supabaseClient.auth.signUp({
          email,
          password,
          options,
        });
        if (signUpError) setError(signUpError.message);
        // Check if session is null -> email confirmation setting is turned on
        else if (signUpUser && !signUpSession)
          setMessage(i18n?.sign_up?.confirmation_text as string);
        break;
    }

    /*
     * it is possible the auth component may have been unmounted at this point
     * check if component is mounted before setting a useState
     */
    if (isMounted.current) setLoading(false);
  };

  const handleViewChange = (newView) => {
    setDefaultEmail(email);
    setDefaultPassword(password);
    setAuthView(newView);
  };

  return (
    <form
      id={authView === "sign_in" ? `auth-sign-in` : `auth-sign-up`}
      onSubmit={handleSubmit}
      autoComplete={"on"}
    >
      <Flex direction="column" gap="3">
        <Flex>
          <BackButton
            onClick={(e) => {
              e.preventDefault();
              if (authView === "sign_in") onBackClick();
              else {
                handleViewChange("sign_in");
              }
            }}
          />
          {authView === "sign_in" && (
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleViewChange("sign_up");
              }}
            >
              {i18n?.sign_up?.link_text} {">"}
            </Button>
          )}
        </Flex>

        <Flex direction="column" gap="3">
          {/* email */}
          <div>
            <label htmlFor="email">{labels?.email_label}</label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder={labels?.email_input_placeholder}
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          {/* password */}
          {["sign_in", "sign_up"].includes(authView) && (
            <div>
              <label htmlFor="password">{labels?.password_label}</label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder={labels?.password_input_placeholder}
                defaultValue={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  authView === "sign_in" ? "current-password" : "new-password"
                }
              />
            </div>
          )}
        </Flex>

        {authView === "sign_in" && (
          <a
            href="#auth-forgot-password"
            onClick={(e) => {
              e.preventDefault();
              setAuthView("forgotten_password");
            }}
          >
            {i18n?.forgotten_password?.link_text}
          </a>
        )}

        <button>
          {loading ? labels?.loading_button_label : labels?.button_label}
        </button>

        {authView === "sign_in" && magicLink && (
          <a
            href="#auth-magic-link"
            onClick={(e) => {
              e.preventDefault();
              setAuthView("magic_link");
            }}
          >
            {i18n?.magic_link?.link_text}
          </a>
        )}
      </Flex>
    </form>
  );
}

export const Login = ({ authToken, modalState, setModalState, showToast }) => {
  const [view, setView] = useState();
  if (authToken) {
    return <>Vous êtes déjà connecté.</>;
  }

  if (view === "forgotten_password")
    return (
      <>
        <BackButton
          onClick={(e) => {
            e.preventDefault();
            setView("sign_in");
          }}
        />
        <ForgottenPassword
          supabaseClient={supabase()}
          i18n={i18n}
          setAuthView={(viewName) => setView(viewName)}
          showToast={showToast}
          onSuccess={() => {
            setModalState({ ...modalState, isOpen: false });
          }}
        />
      </>
    );

  return (
    <>
      <EmailAuth
        authView={view}
        setAuthView={(viewName) => setView(viewName)}
        supabaseClient={supabase()}
        i18n={i18n}
        showToast={showToast}
        onBackClick={() => setModalState({ ...modalState, isOpen: false })}
        onSuccess={() => {
          setModalState({ ...modalState, isOpen: false });
        }}
      />
    </>
  );
};
