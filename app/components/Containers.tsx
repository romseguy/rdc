import { Flex as RFlex } from "@radix-ui/themes";
import type React from "react";

export const Flex = ({ children, ...props }: React.PropsWithChildren<{}>) => {
  return (
    <RFlex align="center" gap="1" {...props}>
      {children}
    </RFlex>
  );
};
