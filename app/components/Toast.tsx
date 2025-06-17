import { useState, useEffect } from "react";
import { css } from "@emotion/react";

export interface ToastProps {
  id: number;
  message: string;
  delay: number;
  isError: boolean;
  onHide?: (id: number) => void;
}
const Toast = ({ id, delay = 5500, message, onHide, isError }: ToastProps) => {
  const [className, setClassname] = useState("toast-container show-toast");

  // console.log("🚀 ~ render toast");
  useEffect(() => {
    // console.log("🚀 ~ toast set timeout");
    let hideTimeout: NodeJS.Timeout;
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
