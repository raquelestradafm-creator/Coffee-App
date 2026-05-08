import React, { useState } from "react";
import { COFFEE_OPTIONS, MACHINE_OPTIONS, PEOPLE_OPTIONS, PRESSURE_OPTIONS, QUICK_RESULTS } from "../data.js";
import { cx, h } from "../react-utils.js";
import { Field, inputClass, Section } from "./Fields.js";
import { ScaleRating, StarRating } from "./Rating.js";

export function CoffeeForm({ initialValue, onCancel, onSave }) {
  const [form, setForm] = useState(initialValue);
  const [errors, setErrors] = useState({});

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function toggleQuick(label) {
    setForm((current) => ({
      ...current,
      quickResults: current.quickResults.includes(label)
        ? current.quickResults.filter((item) => item !== label)
        : [...current.quickResults, label]
    }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.date) nextErrors.date = "Elige una fecha.";
    if (!form.machine) nextErrors.machine = "Elige una cafetera.";
    if (!form.coffeeType) nextErrors.coffeeType = "Elige el tipo de café.";
    if (!form.people) nextErrors.people = "Elige para cuántas personas.";
    if (!form.overall) nextErrors.overall = "Valora la taza para guardarla.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSave(form);
  }

  return h(
    "form",
    { onSubmit: submit, className: "flex flex-1 flex-col gap-5 pb-6" },
    h(
      "header",
      { className: "space-y-4 pt-2" },
      h(
        "button",
        {
          type: "button",
          onClick: onCancel,
          className: "inline-flex h-10 items-center rounded-full border border-coffee-foam bg-coffee-milk px-4 text-sm font-semibold text-coffee-roast"
        },
        "Volver"
      ),
      h(
        "div",
        { className: "space-y-2" },
        h("p", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-coffee-aquaDeep" }, "Registra tu café de hoy"),
        h("h1", { className: "text-4xl font-bold leading-tight tracking-tight text-coffee-ink" }, "Borjis Coffe style"),
        h("p", { className: "max-w-xl text-sm leading-6 text-coffee-roast/72" }, "Guarda lo importante de cada preparación y deja pequeñas pistas para la próxima.")
      )
    ),
    h(
      Section,
      { title: "Preparación", subtitle: "Los detalles básicos de esta taza." },
      h(
        "div",
        { className: "grid gap-4 sm:grid-cols-2" },
        h(Field, { label: "Fecha", required: true, error: errors.date },
          h("input", {
            className: inputClass(Boolean(errors.date)),
            type: "date",
            value: form.date,
            onChange: (event) => update("date", event.target.value)
          })
        ),
        h(Field, { label: "Tipo de cafetera", required: true, error: errors.machine },
          h("select", {
            className: inputClass(Boolean(errors.machine)),
            value: form.machine,
            onChange: (event) => update("machine", event.target.value)
          },
            h("option", { value: "" }, "Selecciona una opción"),
            MACHINE_OPTIONS.map((option) => h("option", { key: option, value: option }, option))
          )
        ),
        h(Field, { label: "Tipo de café", required: true, error: errors.coffeeType },
          h("select", {
            className: inputClass(Boolean(errors.coffeeType)),
            value: form.coffeeType,
            onChange: (event) => update("coffeeType", event.target.value)
          },
            h("option", { value: "" }, "Selecciona una opción"),
            COFFEE_OPTIONS.map((option) => h("option", { key: option, value: option }, option))
          )
        ),
        h(Field, { label: "Número de personas", required: true, error: errors.people },
          h("select", {
            className: inputClass(Boolean(errors.people)),
            value: form.people,
            onChange: (event) => update("people", event.target.value)
          },
            h("option", { value: "" }, "Selecciona una opción"),
            PEOPLE_OPTIONS.map((option) => h("option", { key: option, value: option }, option))
          )
        ),
        h(Field, { label: "Marca del café" },
          h("input", {
            className: inputClass(),
            value: form.brand,
            onChange: (event) => update("brand", event.target.value),
            placeholder: "Ej: Nomad, Syra, especial de Colombia"
          })
        ),
        form.machine === "Automática" &&
          h(Field, { label: "Presión" },
            h("select", {
              className: inputClass(),
              value: form.pressure,
              onChange: (event) => update("pressure", event.target.value)
            },
              h("option", { value: "" }, "Selecciona presión"),
              PRESSURE_OPTIONS.map((option) => h("option", { key: option, value: option }, option))
            )
          ),
        form.machine === "Automática" && form.pressure === "Personalizada" &&
          h(Field, { label: "Bares de presión" },
            h("input", {
              className: inputClass(),
              min: "0",
              step: "0.1",
              type: "number",
              value: form.customBars,
              onChange: (event) => update("customBars", event.target.value),
              placeholder: "Ej: 9"
            })
          ),
        form.coffeeType === "En grano" &&
          h(Field, { label: "Cantidad de café en gramos" },
            h("input", {
              className: inputClass(),
              min: "0",
              step: "0.1",
              type: "number",
              value: form.grams,
              onChange: (event) => update("grams", event.target.value),
              placeholder: "Ej: 18"
            })
          )
      )
    ),
    h(
      Section,
      { title: "Resultado en taza", subtitle: "Una valoración sencilla, sin tecnicismos." },
      h(
        "div",
        { className: "space-y-5" },
        h(StarRating, {
          label: "Valoración general",
          required: true,
          value: form.overall,
          onChange: (value) => update("overall", value)
        }),
        errors.overall && h("p", { className: "-mt-3 text-xs font-semibold text-coffee-rose" }, errors.overall),
        h("div", { className: "grid gap-4 sm:grid-cols-2" },
          h(ScaleRating, { label: "Dulzor", value: form.sweetness, onChange: (value) => update("sweetness", value) }),
          h(ScaleRating, { label: "Acidez", value: form.acidity, onChange: (value) => update("acidity", value) }),
          h(ScaleRating, { label: "Amargor", value: form.bitterness, onChange: (value) => update("bitterness", value) }),
          h(ScaleRating, { label: "Cuerpo/intensidad", value: form.body, onChange: (value) => update("body", value) }),
          h(ScaleRating, { label: "Equilibrio", value: form.balance, onChange: (value) => update("balance", value) })
        ),
        h(
          "div",
          { className: "space-y-3" },
          h("p", { className: "text-sm font-semibold" }, "Resultado rápido"),
          h(
            "div",
            { className: "flex flex-wrap gap-2" },
            QUICK_RESULTS.map((label) =>
              h(
                "button",
                {
                  key: label,
                  type: "button",
                  onClick: () => toggleQuick(label),
                  className: cx(
                    "rounded-full border px-3 py-2 text-sm font-semibold transition",
                    form.quickResults.includes(label)
                      ? "border-coffee-aquaDeep bg-coffee-aquaDeep text-coffee-milk"
                      : "border-coffee-foam bg-coffee-milk text-coffee-roast"
                  )
                },
                label
              )
            )
          )
        )
      )
    ),
    h(
      Section,
      { title: "Notas para la próxima preparación" },
      h("textarea", {
        className: `${inputClass()} min-h-32 resize-y leading-6`,
        value: form.note,
        onChange: (event) => update("note", event.target.value),
        placeholder: "Ej: Me ha sabido un poco amargo, quizá usar menos café la próxima vez."
      })
    ),
    h(
      "div",
      { className: "sticky bottom-3 z-10 mt-auto rounded-[1.75rem] border border-coffee-foam bg-coffee-milk/92 p-3 shadow-soft backdrop-blur" },
      h(
        "button",
        { type: "submit", className: "h-14 w-full rounded-2xl bg-coffee-aquaDeep px-5 text-base font-bold text-white shadow-sm transition active:scale-[0.99]" },
        "Guardar café"
      )
    )
  );
}
