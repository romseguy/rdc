import { Button } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { BackButton, Flex, useToast } from "~/components";
import client from "~/lib/supabase/client";
import { useToggleModal } from "~/routes/Modal";
import { Input } from "./ui/input";

function ForgottenPassword({
  i18n,
  redirectTo,
  setAuthView = (string) => {},
  showLinks = false,
}: {
  i18n: any;
  redirectTo?: string;
  setAuthView?: (string: any) => void;
  showLinks?: boolean | undefined;
  onSuccess: () => void;
}) {
  const showToast = useToast();
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
    const { error } = await client().auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) setError(error.message);
    else setMessage(i18n?.forgotten_password?.confirmation_text as string);
    setLoading(false);
  };

  return (
    <form id="auth-forgot-password" onSubmit={handlePasswordReset}>
      <Flex direction="column" gap="3">
        <Flex>
          <BackButton
            onClick={() => {
              setAuthView("sign_in");
            }}
          />
        </Flex>

        <Flex direction="column" gap="3">
          <Input
            id="email"
            type="email"
            name="email"
            placeholder={labels?.email_input_placeholder}
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <Button loading={loading}>
            {loading ? labels?.loading_button_label : labels?.button_label}
          </Button>

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
  setAuthView = (string) => {},
  defaultEmail = "",
  defaultPassword = "",
  redirectTo = "",
  additionalData = {},
  magicLink = true,
  i18n,
  passwordLimit = false,
  onBackClick,
  onSuccess,
}) {
  const showToast = useToast();
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
    setEmail(defaultEmail);
    setPassword(defaultPassword);
  }, [authView]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("🚀 ~ handleSubmit ~ handleSubmit:");
    e.preventDefault();
    setLoading(true);
    switch (authView) {
      case "sign_in":
        console.log("🚀 ~ handleSubmit ~ authView:", authView);
        const { error: signInError } = await client().auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) setError("Identifiants incorrects");
        else onSuccess();
        break;
      case "sign_up":
        if (passwordLimit && password.length > 72) {
          setError(
            "Le mot de passe ne doit pas comporter plus de 72 caractères",
          );
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
        } = await client().auth.signUp({
          email,
          password,
          options,
        });
        if (signUpError) setError(signUpError.message);
        // Check if session is null -> email confirmation setting is turned on
        else if (signUpUser && !signUpSession)
          setMessage(i18n?.sign_up?.confirmation_text as string);
        break;
      case "magic_link":
        break;
    }
    setLoading(false);
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
                setAuthView("sign_in");
              }
            }}
          />
        </Flex>

        <Flex direction="column" gap="3">
          {/* email */}
          <Input
            autoFocus
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder={labels?.email_input_placeholder}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {/* password */}
          {["sign_in", "sign_up"].includes(authView) && (
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
          )}
        </Flex>

        <Button>
          {loading ? labels?.loading_button_label : labels?.button_label}
        </Button>

        {authView === "sign_in" && (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setAuthView("sign_up");
            }}
          >
            {i18n?.sign_up?.link_text} {">"}
          </Button>
        )}

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

const Login = (props) => {
  const { showToast, i18n } = props;
  const toggleModal = useToggleModal();
  const [view, setView] = useState<string>();

  if (view === "forgotten_password")
    return (
      <div id="login-page">
        <ForgottenPassword
          i18n={i18n}
          setAuthView={(viewName) => setView(viewName)}
          onSuccess={() => {
            toggleModal();
          }}
        />
      </div>
    );

  return (
    <div id="login-page">
      <EmailAuth
        authView={view}
        setAuthView={(viewName) => setView(viewName)}
        i18n={i18n}
        onBackClick={() => toggleModal()}
        onSuccess={() => {
          toggleModal();
        }}
      />
    </div>
  );
};

export default Login;
