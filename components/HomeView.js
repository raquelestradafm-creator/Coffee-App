import React, { useMemo, useState } from "react";
import { COFFEE_OPTIONS, MACHINE_OPTIONS } from "../data.js";
import { cx, h } from "../react-utils.js";

export function HomeView({ entries, bestId, onNew, onOpen }) {
  const [filters, setFilters] = useState({ machine: "Todas", coffeeType: "Todos", minRating: "0" });
  const [showFilters, setShowFilters] = useState(false);
  const bestEntry = entries.find((entry) => entry.id === bestId);
  const stats = useMemo(() => buildStats(entries, bestEntry), [entries, bestEntry]);
  const filteredEntries = entries.filter((entry) => {
    const byMachine = filters.machine === "Todas" || entry.machine === filters.machine;
    const byCoffee = filters.coffeeType === "Todos" || entry.coffeeType === filters.coffeeType;
    const byRating = Number(entry.overall || 0) >= Number(filters.minRating);
    return byMachine && byCoffee && byRating;
  });

  return h(
    "div",
    { className: "flex flex-1 flex-col gap-5" },
    h(
      "header",
      { className: "relative overflow-hidden rounded-[2rem] border border-coffee-foam bg-coffee-milk px-5 py-7 text-coffee-ink shadow-soft" },
      h(
        "div",
        { className: "space-y-5" },
        h("p", { className: "text-xs font-bold uppercase tracking-[0.25em] text-coffee-aquaDeep" }, "Diario de café"),
        h("div", { className: "space-y-2" },
          h("h1", { className: "text-4xl font-bold leading-tight tracking-tight" }, "Borjis Coffe style"),
          h("p", { className: "max-w-md text-sm leading-6 text-coffee-roast" }, "Un lugar donde registrar tus mejores creaciones.")
        ),
        h(
          "button",
          {
            onClick: onNew,
            className: "h-14 w-full rounded-2xl bg-coffee-aquaDeep px-5 text-base font-bold text-white shadow-sm transition active:scale-[0.99] sm:w-auto"
          },
          "Nuevo café"
        )
      )
    ),
    h(
      "section",
      { className: "rounded-[1.75rem] border border-coffee-foam bg-coffee-milk/72 p-4" },
      h(
        "button",
        {
          type: "button",
          onClick: () => setShowFilters((current) => !current),
          className: "flex w-full items-center justify-between gap-4 text-left"
        },
        h("span", null,
          h("span", { className: "block text-base font-bold tracking-tight text-coffee-ink" }, "Busca un café específico"),
          h("span", { className: "mt-1 block text-sm text-coffee-roast/70" }, filterSummary(filters))
        ),
        h("span", { className: "shrink-0 rounded-full bg-coffee-sage px-3 py-1 text-sm font-bold text-coffee-aquaDeep" }, showFilters ? "Cerrar" : "Filtros")
      ),
      showFilters && h("div", { className: "mt-4 grid gap-3 sm:grid-cols-3" },
          h(FilterSelect, {
            label: "Cafetera",
            value: filters.machine,
            onChange: (value) => setFilters((current) => ({ ...current, machine: value })),
            options: ["Todas", ...MACHINE_OPTIONS]
          }),
          h(FilterSelect, {
            label: "Tipo de café",
            value: filters.coffeeType,
            onChange: (value) => setFilters((current) => ({ ...current, coffeeType: value })),
            options: ["Todos", ...COFFEE_OPTIONS]
          }),
          h(FilterSelect, {
            label: "Valoración mínima",
            value: filters.minRating,
            onChange: (value) => setFilters((current) => ({ ...current, minRating: value })),
            options: ["0", "1", "2", "3", "4", "5"],
            format: (value) => (value === "0" ? "Cualquiera" : `${value}+ estrellas`)
          })
      )
    ),
    h(
      "section",
      { className: "grid grid-cols-3 gap-2" },
      h(StatCard, { label: "Total", value: stats.total }),
      h(StatCard, { label: "Cafetera más usada", value: stats.favoriteMachine }),
      h(StatCard, { label: "Mejor café", value: stats.bestLabel, featured: true })
    ),
    h(BestCoffeeRanking, { bestEntry }),
    h(
      "section",
      { className: "flex flex-1 flex-col gap-3" },
      h("div", { className: "flex items-end justify-between gap-4" },
        h("h2", { className: "text-2xl font-bold tracking-tight" }, "Cafés registrados"),
        h("span", { className: "pb-1 text-sm font-semibold text-coffee-roast/65" }, `${filteredEntries.length} visibles`)
      ),
      filteredEntries.length
        ? h("div", { className: "space-y-3" },
            filteredEntries.map((entry) =>
              h(CoffeeCard, {
                key: entry.id,
                entry,
                isBest: entry.id === bestId,
                onOpen: () => onOpen(entry.id)
              })
            )
          )
        : h(EmptyState, { hasEntries: entries.length > 0, onNew })
    )
  );
}

function StatCard({ label, value, featured = false }) {
  return h(
    "div",
    { className: cx("min-h-24 rounded-2xl border p-3", featured ? "border-coffee-aquaDeep/45 bg-coffee-sage/55" : "border-coffee-foam bg-coffee-milk/72") },
    h("p", { className: "text-[0.68rem] font-bold uppercase leading-4 tracking-[0.12em] text-coffee-roast/60" }, label),
    h("p", { className: "mt-2 line-clamp-2 text-sm font-bold leading-5 text-coffee-ink" }, value)
  );
}

function FilterSelect({ label, value, onChange, options, format = (item) => item }) {
  return h(
    "label",
    { className: "space-y-2" },
    h("span", { className: "block text-xs font-bold uppercase tracking-[0.12em] text-coffee-roast/60" }, label),
    h("select", {
      className: "h-12 w-full rounded-2xl border border-coffee-foam bg-coffee-milk px-3 text-sm font-semibold text-coffee-ink outline-none focus:border-coffee-aquaDeep focus:ring-4 focus:ring-coffee-aqua/30",
      value,
      onChange: (event) => onChange(event.target.value)
    },
      options.map((option) => h("option", { key: option, value: option }, format(option)))
    )
  );
}

function CoffeeCard({ entry, isBest, onOpen }) {
  const status = getCoffeeStatus(entry.overall);

  return h(
    "button",
    {
      onClick: onOpen,
      className: cx(
        "w-full rounded-[1.5rem] border p-4 text-left shadow-sm transition active:scale-[0.99]",
        status.card,
        isBest ? "ring-4 ring-coffee-aqua/35" : ""
      )
    },
    h("div", { className: "flex items-start justify-between gap-3" },
      h("div", { className: "min-w-0 space-y-2" },
        h("div", { className: "flex flex-wrap items-center gap-2" },
          h("span", { className: "rounded-full bg-coffee-milk px-3 py-1 text-xs font-bold text-coffee-roast" }, formatDate(entry.date)),
          h("span", { className: cx("rounded-full px-3 py-1 text-xs font-bold", status.badge) }, status.label),
          isBest && h("span", { className: "rounded-full bg-coffee-aqua px-3 py-1 text-xs font-bold text-coffee-ink" }, "Mejor")
        ),
        h("h3", { className: "truncate text-lg font-bold text-coffee-ink" }, `${entry.machine} · ${entry.coffeeType}`),
        entry.brand && h("p", { className: "text-sm font-semibold text-coffee-roast" }, entry.brand),
        entry.note && h("p", { className: "line-clamp-2 text-sm leading-6 text-coffee-roast/70" }, entry.note)
      ),
      h("div", { className: "shrink-0 text-right" },
        h("p", { className: "text-xl text-coffee-gold" }, stars(entry.overall)),
        h("p", { className: "text-xs font-bold text-coffee-roast/60" }, `${entry.overall}/5`)
      )
    )
  );
}

function EmptyState({ hasEntries, onNew }) {
  return h(
    "div",
    { className: "rounded-[1.75rem] border border-dashed border-coffee-foam bg-coffee-milk p-6 text-center" },
    h("h3", { className: "text-2xl font-bold tracking-tight" }, hasEntries ? "No hay cafés con esos filtros" : "Todavía no hay cafés guardados"),
    h("p", { className: "mx-auto mt-2 max-w-sm text-sm leading-6 text-coffee-roast/70" },
      hasEntries ? "Prueba con otra combinación para volver a ver tus preparaciones." : "Empieza con la taza de hoy y deja que el diario encuentre patrones bonitos."
    ),
    !hasEntries && h("button", { onClick: onNew, className: "mt-5 h-12 rounded-2xl bg-coffee-ink px-5 text-sm font-bold text-coffee-milk" }, "Registrar primer café")
  );
}

function BestCoffeeRanking({ bestEntry }) {
  return h(
    "section",
    { className: "rounded-[1.5rem] border border-coffee-aquaDeep/20 bg-coffee-sage/35 p-3 shadow-sm" },
    h("p", { className: "text-[0.7rem] font-bold uppercase tracking-[0.16em] text-coffee-aquaDeep" }, "Tu mejor café hasta el momento"),
    bestEntry
      ? h("div", { className: "mt-2 space-y-3" },
          h("div", { className: "flex items-center justify-between gap-3" },
            h("div", { className: "min-w-0" },
              h("h2", { className: "truncate text-lg font-bold tracking-tight text-coffee-ink" }, `${bestEntry.machine} · ${bestEntry.coffeeType}`),
              h("p", { className: "mt-0.5 truncate text-xs font-semibold text-coffee-roast/75" }, bestEntry.brand || "Sin marca")
            ),
            h("div", { className: "shrink-0 text-right" },
              h("p", { className: "text-base font-bold text-coffee-ink" }, `${bestEntry.overall}/5`),
              h("p", { className: "text-sm text-coffee-gold" }, stars(bestEntry.overall))
            )
          ),
          h("div", { className: "flex flex-wrap gap-2" },
            h(BestPill, { label: formatDate(bestEntry.date) }),
            h(BestPill, { label: bestEntry.people }),
            h(BestPill, { label: bestEntry.machine }),
            h(BestPill, { label: bestEntry.coffeeType }),
            bestEntry.machine === "Automática" && h(BestPill, { label: bestEntry.pressure === "Personalizada" ? `${bestEntry.customBars || "?"} bares` : bestEntry.pressure || "Presión sin indicar" }),
            bestEntry.coffeeType === "En grano" && h(BestPill, { label: bestEntry.grams ? `${bestEntry.grams} g` : "Gramos sin indicar" })
          )
        )
      : h("p", { className: "mt-2 text-sm leading-6 text-coffee-roast/75" }, "Marca tu favorito cuando encuentres una taza que quieras recordar.")
  );
}

function BestPill({ label }) {
  return h(
    "span",
    { className: "rounded-full border border-coffee-aquaDeep/15 bg-coffee-milk/70 px-3 py-1 text-xs font-bold text-coffee-roast" },
    label || "Sin indicar"
  );
}

function filterSummary(filters) {
  const active = [];
  if (filters.machine !== "Todas") active.push(filters.machine);
  if (filters.coffeeType !== "Todos") active.push(filters.coffeeType);
  if (filters.minRating !== "0") active.push(`${filters.minRating}+ estrellas`);
  return active.length ? active.join(" · ") : "Todos los cafés guardados";
}

function buildStats(entries, bestEntry) {
  const machineCounts = entries.reduce((acc, entry) => {
    acc[entry.machine] = (acc[entry.machine] || 0) + 1;
    return acc;
  }, {});
  const favoriteMachine = Object.entries(machineCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Aún no";
  const bestLabel = bestEntry ? `${bestEntry.machine}, ${bestEntry.overall}/5` : "Sin marcar";
  return { total: String(entries.length), favoriteMachine, bestLabel };
}

export function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function stars(value) {
  return "★★★★★".slice(0, Number(value || 0)) || "Sin valorar";
}

function getCoffeeStatus(value) {
  const rating = Number(value || 0);
  if (rating >= 4) {
    return {
      label: "Repetir",
      card: "border-[#8fa47d] bg-[#eef4e8]",
      badge: "bg-[#6f8a5d] text-white"
    };
  }
  if (rating === 3) {
    return {
      label: "Neutro",
      card: "border-[#d3a76f] bg-[#fbf1e3]",
      badge: "bg-[#c18848] text-white"
    };
  }
  return {
    label: "No repetir",
    card: "border-[#cf8f83] bg-[#faece8]",
    badge: "bg-[#b96a5e] text-white"
  };
}
