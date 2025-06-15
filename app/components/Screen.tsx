import { Flex } from "./Containers";

export const FullScreen = ({ children, ...props }) => {
  return (
    <Flex align="center" justify="center" height="100vh" {...props}>
      {children}
    </Flex>
  );
};
