import {
  ArrowUpIcon,
  BellIcon,
  HeartIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import { Toggle } from "@radix-ui/react-toggle";
import { useDispatch, useSelector } from "react-redux";
import { Flex, useToggleModal } from "~/components";
import { getState, setState } from "~/store";
import { useCookie } from "~/utils/cookie";

export const ToggleButtonsRight = (props) => {
  const {
    auth: { user },
    isMobile,
    ...state
  } = useSelector(getState);
  const [appearance, setAppearance] = useCookie("color-mode", state.appearance);
  const dispatch = useDispatch();
  const toggleModal = useToggleModal();

  return (
    <div id="toggle-buttons">
      <Flex>
        <Toggle
          onPressedChange={() => {
            toggleModal("heart-modal");
          }}
        >
          <HeartIcon />
        </Toggle>
        <Toggle
          onPressedChange={() => {
            toggleModal("notif-modal", {
              email: user?.email,
            });
          }}
        >
          <BellIcon />
        </Toggle>
        <Toggle
          onPressedChange={() => {
            const a = appearance === "dark" ? "light" : "dark";
            setAppearance(a);
            dispatch(
              setState({
                appearance: a,
              }),
            );
          }}
        >
          {appearance === "dark" ? <SunIcon /> : <MoonIcon />}
        </Toggle>
        <Toggle
          onPressedChange={() =>
            window.scrollTo({ top: 0, behavior: "smooth" })
          }
        >
          <ArrowUpIcon />
        </Toggle>
      </Flex>
    </div>
  );
};
