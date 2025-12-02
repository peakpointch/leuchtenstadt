import * as React from "react";

export interface CalcProps {
  variant: "Light" | "Dark";
}

export const Calculator = ({ variant }: CalcProps) => (
  <span
    style={{
      backgroundColor: variant === "Light" ? "#eee" : "#000",
      borderRadius: "1em",
      color: variant === "Light" ? "#000" : "#fff",
      display: "inline-block",
      fontSize: "14px",
      lineHeight: 2,
      padding: "0 1em",
    }}
  ></span>
);
