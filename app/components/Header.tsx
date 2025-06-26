import { useSelector } from "react-redux";
import { Flex } from "~/components";
import { getState } from "~/store";

export const Header = (props) => {
  const { loaderData } = props;
  const { isMobile } = useSelector(getState);

  return (
    <Flex direction="column" gap="3" {...(isMobile ? { align: "start" } : {})}>
      Header
    </Flex>
  );
};
