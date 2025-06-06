import { useState, useEffect } from "react";
import "./Toast.scss";
import { css } from "@emotion/react";

const Toast = ({ id, delay = 5500, message, onHide, isError }) => {
  const [className, setClassname] = useState("toast-container show-toast");

  // console.log("🚀 ~ render toast");
  useEffect(() => {
    // console.log("🚀 ~ toast set timeout");
    let hideTimeout = null;
    const timeout = setTimeout(() => {
      // console.log("🚀 ~ toast timeout");
      setClassname("toast-container hide-toast");
      // console.log("🚀 ~ hide toast");
      hideTimeout = setTimeout(() => {
        onHide && onHide(id);
      }, 500);
    }, delay);
    return () => {
      // console.log("🚀 ~ toast clear timeout");
      clearTimeout(timeout);
      clearTimeout(hideTimeout);
    };
  }, [id, delay, onHide]);
  return (
    <div
      className={className}
      css={css`
        background-color: ${isError ? "red" : "skyblue"};
      `}
    >
      {message}
    </div>
  );
};

export const ToastsContainer = ({ toasts, onToastFinished }) => {
  return (
    <div className="toasts-container" css={css``}>
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} onHide={onToastFinished} />
      ))}
    </div>
  );
};
