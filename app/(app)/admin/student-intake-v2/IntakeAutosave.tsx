"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  saveStatusLabel,
  type IntakeSaveResult,
  type IntakeSaveStatus,
} from "@/lib/student-intake-v2/autosave";

export type AutosaveFlush = () => Promise<boolean>;

export function useIntakeAutosave({
  enabled,
  dirty,
  signature,
  delay = 1200,
  save,
  onSuccess,
  onSaving,
  onRegisterFlush,
}: {
  enabled: boolean;
  dirty: boolean;
  signature: string;
  delay?: number;
  save: () => Promise<IntakeSaveResult>;
  onSuccess: (intake: any) => void;
  onSaving?: (saving: boolean) => void;
  onRegisterFlush?: (flush: AutosaveFlush | null) => void;
}) {
  const [status, setStatus] = useState<IntakeSaveStatus>("idle");
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const [paused, setPaused] = useState(false);
  const saveRef = useRef(save);
  const onSuccessRef = useRef(onSuccess);
  const dirtyRef = useRef(dirty);
  const pausedRef = useRef(paused);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef<Promise<boolean> | null>(null);
  const queuedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    saveRef.current = save;
    onSuccessRef.current = onSuccess;
  }, [onSuccess, save]);

  useEffect(() => {
    dirtyRef.current = dirty;
  }, [dirty]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onSaving?.(status === "saving");
    return () => onSaving?.(false);
  }, [onSaving, status]);

  useEffect(() => {
    if (status !== "saved") return;
    const timer = setTimeout(() => {
      if (!dirtyRef.current) setStatus((current) => (current === "saved" ? "idle" : current));
    }, 2500);
    return () => clearTimeout(timer);
  }, [status]);

  const run = useCallback(async (saveOverride?: () => Promise<IntakeSaveResult>): Promise<boolean> => {
    if (pausedRef.current) return false;
    if (inFlightRef.current) {
      queuedRef.current = true;
      return inFlightRef.current;
    }
    setStatus("saving");
    setError("");
    const promise = (async () => {
      try {
        const result = await (saveOverride ?? saveRef.current)();
        if (!mountedRef.current) return result.ok;
        if (result.ok) {
          setConflict(false);
          setPaused(false);
          pausedRef.current = false;
          setStatus("saved");
          onSuccessRef.current(result.intake);
          return true;
        }
        if (result.status === 409) {
          setConflict(true);
          setPaused(true);
          pausedRef.current = true;
          setStatus("conflict");
          setError(result.error);
          return false;
        }
        setStatus("error");
        setError(result.error);
        return false;
      } catch (caught) {
        if (!mountedRef.current) return false;
        setStatus("error");
        setError(caught instanceof Error ? caught.message : "Save failed");
        return false;
      } finally {
        inFlightRef.current = null;
        if (queuedRef.current) {
          queuedRef.current = false;
          if (!pausedRef.current) void run();
        }
      }
    })();
    inFlightRef.current = promise;
    return promise;
  }, []);

  const flush = useCallback(async (): Promise<boolean> => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (pausedRef.current || conflict) return false;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (!dirtyRef.current) return true;
      const saved = await run();
      if (!saved) return false;
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return !dirtyRef.current;
  }, [conflict, run]);

  const retry = useCallback(
    async (saveOverride?: () => Promise<IntakeSaveResult>): Promise<boolean> => {
      setPaused(false);
      pausedRef.current = false;
      setConflict(false);
      return run(saveOverride);
    },
    [run],
  );

  useEffect(() => {
    if (!enabled || !dirty || paused || conflict) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void run();
    }, delay);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [conflict, delay, dirty, enabled, paused, run, signature]);

  useEffect(() => {
    onRegisterFlush?.(flush);
    return () => onRegisterFlush?.(null);
  }, [flush, onRegisterFlush]);

  return { status, error, conflict, flush, retry };
}

export function AutosaveStatus({
  status,
  error,
  dirty,
  conflict,
  onReloadLatest,
  onReconcile,
}: {
  status: IntakeSaveStatus;
  error: string;
  dirty: boolean;
  conflict: boolean;
  onReloadLatest?: () => void | Promise<void>;
  onReconcile: () => void | Promise<void>;
}) {
  const reloadLatest = onReloadLatest ?? (() => window.location.reload());
  return (
    <div className="space-y-2">
      {conflict && (
        <div role="alert" className="rounded-sm border border-amber-400/35 bg-amber-500/10 p-3 text-[12px] text-amber-100">
          <p className="font-semibold">This draft changed in another tab or session.</p>
          <p className="mt-1 text-amber-100/80">
            Your unsaved edits are preserved. Autosave is paused. Reload the latest saved answers or explicitly reconcile
            your edits with the latest revision.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void reloadLatest()}
              className="rounded-sm border border-amber-300/40 px-3 py-1.5 text-[11px] font-semibold text-amber-100 hover:bg-amber-400/10"
            >
              Reload latest
            </button>
            <button
              type="button"
              onClick={() => void onReconcile()}
              className="rounded-sm bg-amber-400/20 px-3 py-1.5 text-[11px] font-semibold text-amber-50 hover:bg-amber-400/30"
            >
              Reconcile my edits &amp; retry
            </button>
          </div>
        </div>
      )}
      <p
        role="status"
        className={`text-[12px] ${
          status === "error" || conflict
            ? "text-red-300"
            : status === "saved"
              ? "text-emerald-300"
              : "text-white/55"
        }`}
      >
        {saveStatusLabel(status, dirty, error)}
      </p>
    </div>
  );
}

export async function fetchLatestIntake(intakeId: string, studentUserId: string): Promise<any> {
  const response = await fetch(
    `/api/admin/student-intake-v2?action=get&intakeId=${encodeURIComponent(intakeId)}&studentUserId=${encodeURIComponent(studentUserId)}`,
    { cache: "no-store", credentials: "same-origin" },
  );
  const data = (await response.json().catch(() => ({}))) as { error?: string; intake?: any };
  if (!response.ok || !data.intake) throw new Error(data.error || "Unable to load the latest saved answers.");
  return data.intake;
}
