"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type Toast = { id: number; message: string; variant?: "default" | "destructive" }

type ToastContextValue = {
  show: (message: string, variant?: Toast["variant"]) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string, variant: Toast["variant"] = "default") => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message, variant }])
  }, [])

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map((t) => setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3000))
    return () => timers.forEach(clearTimeout)
  }, [toasts])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-[60] flex w-full justify-center px-4">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`rounded-md border px-4 py-2 text-sm shadow-md ${
                t.variant === "destructive"
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-background text-foreground"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}


