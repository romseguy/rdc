import { useStorage } from "@charlietango/hooks/use-storage";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigation } from "react-router";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { setState } from "~/store";

export const Auth = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  let [authToken] = useStorage(tokenKey, {
    type: "local",
  });
  useEffect(() => {
    if (navigation.state === "idle") {
      if (!authToken && process.env.NODE_ENV === "development") {
        authToken = import.meta.env.VITE_PUBLIC_AUTH_TOKEN;
      }
      if (authToken) {
        const { user, ...token } = JSON.parse(authToken);
        dispatch(
          setState({
            auth: {
              user,
              token,
              bearer: authToken,
            },
          }),
        );
      }
    }
  }, [navigation.state, authToken]);

  return null;
};
