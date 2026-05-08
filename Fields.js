import { h } from "../react-utils.js";

export function Field({ label, children, required = false, error }) {
  return h(
    "label",
    { className: "block space-y-2" },
    h(
      "span",
      { className: "text-sm font-semibold text-coffee-ink" },
      label,
      required ? " *" : ""
    ),
    children,
    error && h("span", { className: "block text-xs font-semibold text-coffee-rose" }, error)
  );
}

export function inputClass(hasError = false) {
  return `w-full rounded-2xl border bg-coffee-milk px-4 py-3 text-base text-coffee-ink outline-none transition placeholder:text-coffee-roast/40 focus:ring-4 ${
    hasError
      ? "border-coffee-rose focus:border-coffee-rose focus:ring-coffee-rose/15"
      : "border-coffee-foam focus:border-coffee-aquaDeep focus:ring-coffee-aqua/30"
  }`;
}

export function Section({ title, subtitle, children }) {
  return h(
    "section",
    { className: "space-y-4 rounded-[1.75rem] border border-coffee-foam bg-white/54 p-4 shadow-sm" },
    h(
      "div",
      { className: "space-y-1" },
      h("h2", { className: "text-xl font-bold tracking-tight text-coffee-ink" }, title),
      subtitle && h("p", { className: "text-sm leading-6 text-coffee-roast/70" }, subtitle)
    ),
    children
  );
}
