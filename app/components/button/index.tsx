import React from "react";
import { IButtonProps } from "./interface";

export default function Button(props: IButtonProps) {
  const { buttonText, buttonClassName, isDisabled, isLoading, onClick } = props;
  return (
    <button
      type="button"
      className={`font-medium px-4 py-2 transition-all ${buttonClassName}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <p>Loading...</p> : <p>{buttonText}</p>}
    </button>
  );
}
