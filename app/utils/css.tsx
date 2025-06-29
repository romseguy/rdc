import type { CSSProperties } from "react";

export const linkButton = (str?: string) =>
  `
  color: white;
  background: var(--accent-9);
  font-size: var(--font-size-4);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-4);
  padding: 12px;
  text-decoration: none;
  text-align: center;
  &:hover {
    background: var(--accent-10);
  }
` + str;

export const pageTitleStyle: (isMobile: boolean) => CSSProperties = (
  isMobile,
) => {
  return {
    ...(!isMobile ? {} : { paddingLeft: "3px", fontSize: "32px" }),
  };
};
