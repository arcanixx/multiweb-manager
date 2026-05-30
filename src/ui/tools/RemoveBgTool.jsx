// =============================================================================
// FILE: RemoveBgTool.jsx
// PATH: src/ui/tools/RemoveBgTool.jsx
// VERSION: 0.0.3
// PURPOSE: Narzędzie do masowego usuwania tła ze zdjęć przez API remove.bg.
// FUNCTIONS: RemoveBgTool
// DEPENDS ON: react, axios, icons, translations.js, loggerRenderer, config, notificationsManager.js
// UWAGA: Nie usuwać komentarzy – opisują flow aplikacji.
// =============================================================================

import React, { useState, useCallback } from "react";
import axios from "axios";
import { ICONS } from "../../utils/icons";
import { TranslationContext } from '../utils/translations.js';
import { logInfo, logError, logWarn, logDebug } from "../../utils/loggerRenderer";
import { API_ENDPOINTS } from "../../config";
import { showNotification } from '../../utils/notificationsManager.js';

// ─── RemoveBgTool() – narzędzie do usuwania tła przez API remove.bg
//   @param {Object} props – właściwości komponentu
//   @param {string} props.apiKey – klucz API remove.bg
//   @param {string} props.plan – plan subskrypcji (free/pro)
//   @returns {JSX.Element} – renderowany interfejs narzędzia

export default function RemoveBgTool({ apiKey, plan = "free" }) {
  const { t } = React.useContext(TranslationContext);
  const MAX_FILES = plan === "pro" ? 120 : 30;
  const [files, setFiles] = useState([]); // { file, status, error }
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(0);
  const [errors, setErrors] = useState(0);
  const [dragging, setDragging] = useState(false);
  const addFiles = useCallback(
    newFiles => {
      const all = [
        ...files,
        ...newFiles
          .filter(f => f.type.startsWith("image/"))
          .map(f => ({ file: f, status: "pending", error: null }))
      ].slice(0, MAX_FILES);
      setFiles(all);
      logInfo(`RemoveBg: ${all.length} files queued`);
    },
    [files]
  );
  const handleDrop = useCallback(
    e => {
      e.preventDefault();
      setDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      addFiles(dropped);
    },
    [addFiles]
  );
  
   // ─── handleFileSelect() – Obsługuje wybór plików przez użytkownika – dodaje wybrane obrazy do kolejki przetwarzania i czyści pole wyboru pliku.
   //   @param {React.ChangeEvent<HTMLInputElement>} e – zdarzenie zmiany wyboru pliku
   const handleFileSelect = e => {
    addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

   // ─── removeFile() – Usuwa plik z kolejki przetwarzania pod podanym indeksem.
   //   @param {number} idx – indeks pliku do usunięcia
   const removeFile = idx => {
    setFiles(f => f.filter((_, i) => i !== idx));
  };

   // ─── clearList() – Czyści całą kolejkę plików oraz zeruje liczniki przetworzonych i błędnych plików.
   const clearList = () => {
    setFiles([]);
    setDone(0);
    setErrors(0);
  };

   // ─── processImages() – Przetwarza wszystkie kolejkowane obrazy przez API remove.bg – pobiera wyniki, inicjalizuje pobieranie plików i aktualizuje status przetwarzania.
   //   @returns {Promise<void>} – obietnica rozwiązywana po zakończeniu przetwarzania wszystkich obrazów
   const processImages = async () => {
    if (!apiKey) {
      showNotification(t('removebg.no_api_key'), 'warning');
      logError("RemoveBg: no API key");
      return;
    }
    if (!files.length) return;

    setProcessing(true);
    setDone(0);
    setErrors(0);

    let doneCount = 0;
    let errCount = 0;

    for (let i = 0; i < files.length; i++) {
      const { file } = files[i];

      setFiles(prev =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "processing" } : f
        )
      );

      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("size", "auto");

      try {
        const res = await axios.post(API_ENDPOINTS.removeBg, formData, {
          headers: { "X-Api-Key": apiKey },
          responseType: "blob"
        });

        const url = URL.createObjectURL(res.data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `nobg_${file.name.replace(/\.[^.]+$/, "")}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);

        setFiles(prev =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "done" } : f
          )
        );
        doneCount++;
        setDone(doneCount);
        logInfo(`RemoveBg: done for ${file.name}`);
      } catch (err) {
        const errMsg = err.response?.data
          ? `HTTP ${err.response.status}`
          : err.message;

        setFiles(prev =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "error", error: errMsg } : f
          )
        );
        errCount++;
        setErrors(errCount);
        logError(`RemoveBg: failed for ${file.name}: ${errMsg}`);
      }
    }

    setProcessing(false);
    logInfo(`RemoveBg: batch done. ${doneCount} ok, ${errCount} errors`);
  };

  const pendingCount = files.filter(f => f.status === "pending").length;

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: "20px 24px",
        background: "var(--bg-primary)"
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              margin: 0,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            {ICONS.REMOVEBG} {t("removebg.title")}
          </h1>
          <div
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 4
            }}
          >
            {plan === "pro"
              ? t("removebg.pro_plan_info")
              : t("removebg.free_plan_info")}
          </div>
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={e => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onClick={() => document.getElementById("rbg-input").click()}
          style={{
            border: `2px dashed ${
              dragging ? "var(--accent)" : "var(--border)"
            }`,
            borderRadius: 12,
            padding: "32px 20px",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s",
            background: dragging
              ? "var(--bg-active)"
              : "var(--bg-secondary)",
            marginBottom: 16
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 8 }}>{ICONS.IMAGE}</div>
          <div
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              marginBottom: 4
            }}
          >
            {t("removebg.drop_zone", { max: MAX_FILES })}
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {t("removebg.drop_zone_hint")}
          </div>
          <input
            id="rbg-input"
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </div>

        {files.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12
              }}
            >
              <span
                style={{ fontSize: 13, color: "var(--text-secondary)" }}
              >
                {t("removebg.selected", {
                  count: files.length,
                  max: MAX_FILES
                })}
              </span>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: 12 }}
                  onClick={clearList}
                  disabled={processing}
                >
                  {ICONS.DELETE} {t("removebg.clear")}
                </button>

                <button
                  className="btn btn-primary"
                  style={{ fontSize: 12 }}
                  onClick={processImages}
                  disabled={processing || pendingCount === 0}
                >
                  {processing ? (
                    <>
                      <span
                        style={{
                          animation: "spin 1s linear infinite",
                          display: "inline-block"
                        }}
                      >
                        ⟳
                      </span>{" "}
                      {t("removebg.processing")}
                    </>
                  ) : (
                    <>
                      {ICONS.PROCESS} {t("removebg.process")}
                    </>
                  )}
                </button>
              </div>
            </div>

            {processing && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    height: 4,
                    background: "var(--border)",
                    borderRadius: 2,
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "var(--accent)",
                      width: `${
                        ((done + errors) / files.length) * 100
                      }%`,
                      transition: "width 0.3s ease"
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 4
                  }}
                >
                  {done + errors} / {files.length} · {done} ok · {errors}{" "}
                  {t("removebg.errors_short")}
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4
              }}
            >
              {files.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)"
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>
                    {item.status === "done"
                      ? ICONS.DONE
                      : item.status === "error"
                      ? ICONS.WARNING
                      : item.status === "processing"
                      ? (
                        <span
                          style={{
                            animation: "spin 1s linear infinite",
                            display: "inline-block"
                          }}
                        >
                          ⟳
                        </span>
                        )
                      : ICONS.IMAGE}
                  </span>

                  <span
                    style={{
                      flex: 1,
                      fontSize: 12,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color:
                        item.status === "error"
                          ? "var(--danger)"
                          : item.status === "done"
                          ? "var(--success)"
                          : "var(--text-primary)"
                    }}
                  >
                    {item.file.name}
                    {item.error && (
                      <span
                        style={{ fontSize: 10, marginLeft: 6 }}
                      >
                        ({item.error})
                      </span>
                    )}
                  </span>

                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      flexShrink: 0
                    }}
                  >
                    {(item.file.size / 1024).toFixed(0)} KB
                  </span>

                  {item.status === "pending" && (
                    <button
                      className="btn-icon"
                      style={{ fontSize: 11 }}
                      onClick={() => removeFile(i)}
                    >
                      {ICONS.CLOSE}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!processing && done > 0 && (
          <div
            style={{
              marginTop: 16,
              padding: "10px 14px",
              background: "var(--bg-secondary)",
              borderRadius: 8,
              fontSize: 13,
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            {ICONS.DONE} {t("removebg.done", { count: done })}
          </div>
        )}
      </div>
    </div>
  );
}