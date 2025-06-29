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

export const toggleCss = (appearance, isMobile) => `
    display: flex;
    align-items: center;
    justify-content: center;
    height: ${isMobile ? "48px" : "28px"};
    width: ${isMobile ? "48px" : "28px"};
    background-color: ${appearance === "dark" ? "black" : "white"};
    border: 1px solid ${appearance === "dark" ? "white" : "black"};

    &:hover {
      background-color: ${
        appearance === "dark" ? "var(--violet-3)" : "var(--violet-6)"
      };
      path {
        fill: currentColor;
      }
    }

    &:focus {
      box-shadow: 0 0 0 2px ${appearance === "dark" ? "white" : "black"};
    }

    path {
      fill: ${appearance === "dark" ? "white" : "black"};
    }
  `;

export const pageTitleStyle: (isMobile: boolean) => CSSProperties = (
  isMobile,
) => {
  return {
    fontFamily: "Griffy",
    fontWeight: "normal",
    cursor: "pointer",
    ...(!isMobile
      ? {
          background: "purple",
          borderRadius: 9999,
          fontSize: "36px",
          letterSpacing: 2,
          paddingLeft: "24px",
          paddingRight: "24px",
          textAlign: "center",
        }
      : { paddingLeft: "3px" }),
  };
};
