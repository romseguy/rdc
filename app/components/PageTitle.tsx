import { Button, Separator } from "@radix-ui/themes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Flex, UserIcon } from "~/components";
import { useToggleModal } from "~/components/Modal";
import { tokenKey } from "~/lib/supabase/tokenKey";
import { getState, setState } from "~/store";
import { localize, pageTitleStyle } from "~/utils";

export const PageTitle = () => {
  const state = useSelector(getState);
  const { isMobile, auth } = state;
  const user = auth?.user;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleModal = useToggleModal();

  return (
    <Flex justify="between" pb="3" pr="1" pt="3">
      {!isMobile && (
        <Separator style={{ width: "80px", visibility: "hidden" }} />
      )}
      <h1
        style={pageTitleStyle(isMobile)}
        onClick={() => {
          navigate("/");
        }}
      >
        <Flex>{import.meta.env.VITE_PUBLIC_TITLE}</Flex>
      </h1>
      <Button
        className="with-icon"
        type="button"
        onClick={async (e) => {
          e.stopPropagation();

          if (user) {
            const ok = confirm("Êtes-vous sûr de vouloir vous déconnecter?");
            if (ok) {
              dispatch(setState({ auth: undefined }));
              localStorage.removeItem(tokenKey);
            }
          } else {
            toggleModal();
          }
        }}
      >
        <UserIcon />
        {user ? <div>{user.email}</div> : localize("Connexion", "Login")}
      </Button>
    </Flex>
  );
};
