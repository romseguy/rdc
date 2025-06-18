import type { CSSProperties } from "react";

export const toggleCss = (appearance) => `
    display: flex;
    align-items: center;
    justify-content: center;
    height: 28px;
    width: 28px;
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
    color: "white",
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
