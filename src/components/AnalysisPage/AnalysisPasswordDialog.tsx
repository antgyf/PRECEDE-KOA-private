import { isAxiosError } from "axios";
import { useEffect, useRef, useState, type FormEvent } from "react";
import api from "../../api/api";
import type { Assessment } from "../../api/analysisAccess";

const copy = {
  en: {
    title: "Unlock analysis",
    description: "Ask a member of the study team to enter the analysis password.",
    password: "Analysis password",
    unlock: "Unlock",
    cancel: "Cancel",
    invalid: "Enter a valid analysis password.",
    incorrect: "Incorrect password. Try again.",
    signedOut: "Your staff session has ended. Sign in and try again.",
    unavailable: "Analysis could not be unlocked. Try again or contact the study team.",
  },
  zh: {
    title: "解锁分析",
    description: "请研究团队成员输入分析密码。",
    password: "分析密码",
    unlock: "解锁",
    cancel: "取消",
    invalid: "请输入有效的分析密码。",
    incorrect: "密码不正确，请重试。",
    signedOut: "您的工作人员登录已过期，请重新登录后重试。",
    unavailable: "无法解锁分析。请重试或联系研究团队。",
  },
};

interface Props {
  assessment: Assessment;
  language: string;
  onUnlock: () => void;
  onCancel: () => void;
}

export default function AnalysisPasswordDialog({ assessment, language, onUnlock, onCancel }: Props) {
  const labels = language === "zh" ? copy.zh : copy.en;
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const request = useRef<AbortController | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<keyof typeof copy.en>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => {
      request.current?.abort();
      element?.close();
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (request.current || !password) return;
    const controller = new AbortController();
    request.current = controller;
    setBusy(true);
    setError(undefined);

    try {
      await api.post("/analysis/access", { ...assessment, password }, {
        signal: controller.signal,
        timeout: 10_000,
      });
      if (!controller.signal.aborted) onUnlock();
    } catch (failure) {
      if (controller.signal.aborted) return;
      const status = isAxiosError(failure) ? failure.response?.status : undefined;
      switch (status) {
        case 400: setError("invalid"); break;
        case 401: setError("signedOut"); break;
        case 403: setError("incorrect"); break;
        default: setError("unavailable");
      }
      setPassword("");
      input.current?.focus();
    } finally {
      request.current = null;
      if (!controller.signal.aborted) setBusy(false);
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="analysis-dialog-title"
      aria-describedby="analysis-dialog-description"
      className="modal text-gray-900 backdrop:bg-black/40"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
    >
      <form className="modal-box w-11/12 max-w-md bg-white" onSubmit={submit}>
        <h2 id="analysis-dialog-title" className="text-xl font-bold">{labels.title}</h2>
        <p id="analysis-dialog-description" className="mt-2">{labels.description}</p>
        <label htmlFor="analysis-password" className="mt-4 block font-semibold">{labels.password}</label>
        <input
          ref={input}
          id="analysis-password"
          type="password"
          autoComplete="off"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="input input-bordered mt-1 w-full bg-white text-gray-900"
        />
        {error && <p role="alert" className="mt-2 text-red-700">{labels[error]}</p>}
        <div className="modal-action">
          <button type="button" className="btn" disabled={busy} onClick={onCancel}>{labels.cancel}</button>
          <button type="submit" className="btn btn-primary" disabled={busy}>{labels.unlock}</button>
        </div>
      </form>
    </dialog>
  );
}
