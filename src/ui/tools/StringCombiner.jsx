// =============================================================================
// FILE: StringCombiner.jsx
// PATH: src/components/StringCombiner.jsx
// VERSION: 0.0.3
// PURPOSE: Generator kombinacji stringów. Podajesz tekst bazowy, znak podziału
//          i N zmiennych (każda z listą wartości). Generator produkuje macierz
//          wszystkich kombinacji – każda combo w osobnym bloku.
//          NAPRAWIONE: cartesian obsługuje 0 zmiennych, prawidłowa obsługa
//          znaku 'enter' jako podziału.
// DEPENDS ON: icons.js, useTranslation.js, logger.js
// FUNCTIONS: generate, cartesian, addVariable, removeVariable,
//            copyResult, clearAllicons.js, useTranslation.js, logger.js
// =============================================================================

import React, { useState, useCallback } from "react";
import { ICONS } from '../../utils/icons";
import { useTranslation } from '../../hooks/useTranslation";
import { log } from '../../utils/logger";

function cartesian(arrays) {
  if (!arrays || arrays.length === 0) return [[]];
  if (arrays.length === 1) return arrays[0].map(v => [v]);
  return arrays.reduce((acc, arr) => {
    const result = [];
    for (const a of acc) {
      for (const b of arr) {
        result.push([...a, b]);
      }
    }
    return result;
  }, [[]]);
}

function parseSplitChar(raw) {
  if (raw === "\\n" || raw === "enter" || raw === "newline") return "\n";
  if (raw === "\\t" || raw === "tab") return "\t";
  if (raw === "space" || raw === " ") return " ";
  return raw || " ";
}

export default function StringCombiner() {
  const { t } = useTranslation();

  const [baseText, setBaseText] = useState("");
  const [splitChar, setSplitChar] = useState(" ");
  const [variables, setVariables] = useState([
    { name: "zmienna1", values: ["wartość1", "wartość2"] }
  ]);
  const [result, setResult] = useState("");
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const sep = parseSplitChar(splitChar);

    const validVars = variables
      .map(v => ({
        ...v,
        values: v.values.filter(val => val.trim())
      }))
      .filter(v => v.values.length > 0);

    if (validVars.length === 0) {
      setResult(baseText);
      setCount(1);
      log("StringCombiner: no variables, output = base text");
      return;
    }

    const valArrays = validVars.map(v => v.values);
    const combos = cartesian(valArrays);

    const lines = combos.map(combo =>
      [baseText, ...combo].filter(Boolean).join(sep)
    );

    const output = lines.join("\n\n");
    setResult(output);
    setCount(combos.length);
    log(`StringCombiner: generated ${combos.length} combinations`);
  }, [baseText, splitChar, variables]);

  const addVariable = () => {
    setVariables(v => [
      ...v,
      { name: `zmienna${v.length + 1}`, values: ["wartość1"] }
    ]);
  };

  const removeVariable = i => {
    setVariables(v => v.filter((_, idx) => idx !== i));
  };

  const updateVariable = (i, field, value) => {
    setVariables(v =>
      v.map((item, idx) => {
        if (idx !== i) return item;
        if (field === "values") {
          return {
            ...item,
            values: value.split(",").map(s => s.trim())
          };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const copyResult = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      log("StringCombiner: result copied to clipboard");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = result;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "20px 24px",
        background: "var(--bg-primary)"
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 800,
            margin: "0 0 4px",
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: 10
          }}
        >
          {ICONS.STRINGCOMBINER} {t("stringCombiner.title")}
        </h1>
        <p
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            margin: "0 0 20px"
          }}
        >
          {t("stringCombiner.subtitle")}
        </p>

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 3 }}>
            <label className="form-label">
              {t("stringCombiner.base_text")}
            </label>
            <input
              className="form-input"
              value={baseText}
              placeholder={t("stringCombiner.base_text_placeholder")}
              onChange={e => setBaseText(e.target.value)}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label className="form-label">
              {t("stringCombiner.split_char")}
            </label>
            <input
              className="form-input"
              value={splitChar}
              placeholder={t("stringCombiner.split_char_placeholder")}
              onChange={e => setSplitChar(e.target.value)}
            />
            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                marginTop: 3
              }}
            >
              {t("stringCombiner.split_char_hint")}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8
            }}
          >
            <label className="form-label" style={{ margin: 0 }}>
              {t("stringCombiner.variables")}
            </label>
            <button
              className="btn btn-secondary"
              style={{ fontSize: 12 }}
              onClick={addVariable}
            >
              {ICONS.PLUS} {t("stringCombiner.add_variable")}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            {variables.map((v, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "flex-start",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 10px"
                }}
              >
                <span
                  style={{
                    color: "var(--text-muted)",
                    paddingTop: 6,
                    cursor: "grab",
                    fontSize: 16
                  }}
                >
                  {ICONS.DRAG}
                </span>

                <div style={{ width: 140, flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      marginBottom: 3
                    }}
                  >
                    {t("stringCombiner.variable_name", { n: i + 1 })}
                  </div>
                  <input
                    className="form-input"
                    style={{ height: 30, fontSize: 12 }}
                    value={v.name}
                    onChange={e =>
                      updateVariable(i, "name", e.target.value)
                    }
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 10,
                      color: "var(--text-muted)",
                      marginBottom: 3
                    }}
                  >
                    {t("stringCombiner.variable_values")}
                  </div>
                  <input
                    className="form-input"
                    style={{ height: 30, fontSize: 12 }}
                    value={v.values.join(", ")}
                    placeholder={t(
                      "stringCombiner.variable_values_placeholder"
                    )}
                    onChange={e =>
                      updateVariable(i, "values", e.target.value)
                    }
                  />
                </div>

                <button
                  className="btn-icon"
                  style={{ marginTop: 18, flexShrink: 0 }}
                  onClick={() => removeVariable(i)}
                >
                  {ICONS.DELETE}
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ fontSize: 13, marginBottom: 16 }}
          onClick={generate}
        >
          {ICONS.PROCESS} {t("stringCombiner.generate")}
        </button>

        {result && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6
              }}
            >
              <label className="form-label" style={{ margin: 0 }}>
                {t("stringCombiner.result_label", { count })}
              </label>
              <button
                className="btn btn-secondary"
                style={{ fontSize: 12 }}
                onClick={copyResult}
              >
                {copied ? (
                  <>
                    {ICONS.DONE} {t("stringCombiner.copied")}
                  </>
                ) : (
                  <>
                    {ICONS.COPY} {t("stringCombiner.copy_result")}
                  </>
                )}
              </button>
            </div>

            <textarea
              className="form-textarea selectable"
              style={{ minHeight: 240, fontSize: 12, lineHeight: 1.6 }}
              value={result}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  );
}