import { h } from "../react-utils.js";
import { formatDate, stars } from "./HomeView.js";

export function DetailView({ entry, isBest, onBack, onDelete, onSetBest }) {
  if (!entry) {
    return h(
      "div",
      { className: "flex flex-1 flex-col items-center justify-center gap-4 text-center" },
      h("h1", { className: "text-3xl font-bold tracking-tight" }, "No encuentro este café"),
      h("button", { onClick: onBack, className: "h-12 rounded-2xl bg-coffee-ink px-5 font-bold text-coffee-milk" }, "Volver")
    );
  }

  return h(
    "div",
    { className: "flex flex-1 flex-col gap-5 pb-6" },
    h(
      "header",
      { className: "space-y-4 pt-2" },
      h("button", {
        onClick: onBack,
        className: "inline-flex h-10 items-center rounded-full border border-coffee-foam bg-coffee-milk px-4 text-sm font-semibold text-coffee-roast"
      }, "Volver"),
      h(
        "div",
        { className: "rounded-[2rem] border border-coffee-foam bg-coffee-milk p-5 text-coffee-ink shadow-soft" },
        h("div", { className: "flex flex-wrap items-center gap-2" },
          h("span", { className: "rounded-full bg-coffee-aqua px-3 py-1 text-xs font-bold text-coffee-ink" }, formatDate(entry.date)),
          isBest && h("span", { className: "rounded-full bg-coffee-aquaDeep px-3 py-1 text-xs font-bold text-white" }, "Tu mejor café hasta ahora")
        ),
        h("h1", { className: "mt-5 text-4xl font-bold leading-tight tracking-tight" }, `${entry.machine} con café ${entry.coffeeType.toLowerCase()}`),
        h("p", { className: "mt-3 text-2xl text-coffee-gold" }, stars(entry.overall)),
        entry.brand && h("p", { className: "mt-2 text-sm font-semibold text-coffee-roast" }, entry.brand)
      )
    ),
    h("section", { className: "grid gap-3 sm:grid-cols-2" },
      h(DetailBlock, { label: "Personas", value: entry.people }),
      h(DetailBlock, { label: "Tipo de cafetera", value: entry.machine }),
      h(DetailBlock, { label: "Tipo de café", value: entry.coffeeType }),
      entry.machine === "Automática" && h(DetailBlock, { label: "Presión", value: entry.pressure === "Personalizada" ? `${entry.customBars || "?"} bares` : entry.pressure || "Sin indicar" }),
      entry.coffeeType === "En grano" && h(DetailBlock, { label: "Cantidad de café en gramos", value: entry.grams ? `${entry.grams} g` : "Sin indicar" })
    ),
    h(
      "section",
      { className: "space-y-4 rounded-[1.75rem] border border-coffee-foam bg-coffee-milk p-4" },
      h("h2", { className: "text-2xl font-bold tracking-tight" }, "Resultado en taza"),
      h("div", { className: "grid gap-3 sm:grid-cols-2" },
        h(Meter, { label: "Dulzor", value: entry.sweetness }),
        h(Meter, { label: "Acidez", value: entry.acidity }),
        h(Meter, { label: "Amargor", value: entry.bitterness }),
        h(Meter, { label: "Cuerpo/intensidad", value: entry.body }),
        h(Meter, { label: "Equilibrio", value: entry.balance })
      ),
      entry.quickResults?.length > 0 &&
        h("div", { className: "flex flex-wrap gap-2 pt-1" },
          entry.quickResults.map((result) => h("span", { key: result, className: "rounded-full bg-coffee-foam px-3 py-2 text-sm font-bold text-coffee-roast" }, result))
        )
    ),
    h(
      "section",
      { className: "rounded-[1.75rem] border border-coffee-foam bg-white/55 p-4" },
      h("h2", { className: "text-2xl font-bold tracking-tight" }, "Notas para la próxima preparación"),
      h("p", { className: "mt-3 whitespace-pre-wrap text-sm leading-7 text-coffee-roast/78" }, entry.note || "Sin nota adicional.")
    ),
    h(
      "div",
      { className: "grid gap-3 sm:grid-cols-2" },
      h("button", {
        onClick: () => onSetBest(entry.id),
        className: "h-13 rounded-2xl border border-coffee-aquaDeep bg-coffee-aqua/30 px-4 py-4 text-sm font-bold text-coffee-ink"
      }, isBest ? "Quitar como mejor café" : "Marcar como mejor café hasta ahora"),
      h("button", {
        onClick: () => {
          if (confirm("¿Eliminar este café del diario?")) onDelete(entry.id);
        },
        className: "h-13 rounded-2xl border border-coffee-rose bg-coffee-rose/10 px-4 py-4 text-sm font-bold text-coffee-rose"
      }, "Eliminar registro")
    )
  );
}

function DetailBlock({ label, value }) {
  return h(
    "div",
    { className: "rounded-2xl border border-coffee-foam bg-coffee-milk p-4" },
    h("p", { className: "text-xs font-bold uppercase tracking-[0.14em] text-coffee-roast/55" }, label),
    h("p", { className: "mt-2 text-base font-bold text-coffee-ink" }, value || "Sin indicar")
  );
}

function Meter({ label, value }) {
  const safeValue = Number(value || 0);
  return h(
    "div",
    { className: "space-y-2" },
    h("div", { className: "flex items-center justify-between text-sm font-semibold" },
      h("span", null, label),
      h("span", { className: "text-coffee-roast/60" }, `${safeValue}/5`)
    ),
    h(
      "div",
      { className: "h-3 overflow-hidden rounded-full bg-coffee-foam" },
      h("div", { className: "h-full rounded-full bg-coffee-aquaDeep", style: { width: `${(safeValue / 5) * 100}%` } })
    )
  );
}
