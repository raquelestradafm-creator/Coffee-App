import React from "react";

export const h = React.createElement;

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
