import { h } from "../react-utils.js";

export function StarRating({ value, onChange, label, required = false }) {
  return h(
    "div",
    { className: "space-y-2" },
    h(
      "div",
      { className: "flex items-center justify-between gap-3" },
      h("label", { className: "text-sm font-semibold text-coffee-ink" }, label, required ? " *" : ""),
      h("span", { className: "text-xs font-medium text-coffee-roast/70" }, value ? `${value}/5` : "Sin valorar")
    ),
    h(
      "div",
      { className: "grid grid-cols-5 gap-2" },
      [1, 2, 3, 4, 5].map((score) =>
        h(
          "button",
          {
            key: score,
            type: "button",
            "aria-label": `${score} estrellas`,
            onClick: () => onChange(score),
            className: `h-11 rounded-full border text-xl transition ${
              score <= value
                ? "border-coffee-aquaDeep bg-coffee-aqua text-coffee-ink shadow-sm"
                : "border-coffee-foam bg-coffee-milk text-coffee-roast/35"
            }`
          },
          "★"
        )
      )
    )
  );
}

export function ScaleRating({ value, onChange, label }) {
  return h(
    "div",
    { className: "space-y-2" },
    h(
      "div",
      { className: "flex items-center justify-between gap-3" },
      h("label", { className: "text-sm font-semibold" }, label),
      h("span", { className: "text-xs font-medium text-coffee-roast/70" }, `${value}/5`)
    ),
    h(
      "div",
      { className: "grid grid-cols-5 gap-2" },
      [1, 2, 3, 4, 5].map((score) =>
        h(
          "button",
          {
            key: score,
            type: "button",
            onClick: () => onChange(score),
            className: `h-10 rounded-full border text-sm font-semibold transition ${
              score === value
                ? "border-coffee-aquaDeep bg-coffee-aquaDeep text-coffee-milk"
                : score < value
                  ? "border-coffee-aquaDeep bg-coffee-aqua/25 text-coffee-roast"
                  : "border-coffee-foam bg-coffee-milk text-coffee-roast/55"
            }`
          },
          score
        )
      )
    )
  );
}
