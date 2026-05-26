"use client";

import * as React from "react";

export type ToastIntent = "default" | "success" | "destructive";

export type ToastMessage = {
  id: string;
  title?: string;
  description?: string;
  intent?: ToastIntent;
  duration?: number;
};

type ToastInput = Omit<ToastMessage, "id">;

type ToastStore = {
  toasts: ToastMessage[];
  toast: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
};

const listeners = new Set<
  React.Dispatch<React.SetStateAction<ToastMessage[]>>
>();
let memoryState: ToastMessage[] = [];

function emit(nextToasts: ToastMessage[]) {
  memoryState = nextToasts;
  listeners.forEach((listener) => listener(nextToasts));
}

function createToastId() {
  return Math.random().toString(36).slice(2);
}

export function toast(input: ToastInput) {
  const id = createToastId();

  emit([
    ...memoryState,
    {
      id,
      intent: "default",
      duration: 4500,
      ...input,
    },
  ]);

  return id;
}

export function dismissToast(id: string) {
  emit(memoryState.filter((toastMessage) => toastMessage.id !== id));
}

export function useToast(): ToastStore {
  const [toasts, setToasts] = React.useState<ToastMessage[]>(memoryState);

  React.useEffect(() => {
    listeners.add(setToasts);

    return () => {
      listeners.delete(setToasts);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: dismissToast,
  };
}
