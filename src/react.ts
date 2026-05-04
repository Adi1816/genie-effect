import { useCallback, useRef, type RefObject } from "react";
import {
  type GenieEffectControls,
  type GenieEffectOptions,
  type GenieTarget,
  runGenieEffect,
} from "./index.js";

type MaybeRef<T> = RefObject<T | null> | T | null | undefined;

function resolveRef<T>(value: MaybeRef<T>) {
  if (!value) {
    return null;
  }

  if (typeof value === "object" && "current" in value) {
    return value.current;
  }

  return value;
}

export function useGenieEffect(defaultOptions: GenieEffectOptions = {}) {
  const activeEffectRef = useRef<GenieEffectControls | null>(null);

  const cancel = useCallback(() => {
    activeEffectRef.current?.cancel();
    activeEffectRef.current = null;
  }, []);

  const run = useCallback(
    (
      source: MaybeRef<HTMLElement>,
      target: MaybeRef<GenieTarget>,
      options: GenieEffectOptions = {},
    ) => {
      const sourceElement = resolveRef(source);
      const targetValue = resolveRef(target);

      if (!sourceElement || !targetValue) {
        return null;
      }

      activeEffectRef.current?.cancel();
      const controls = runGenieEffect(sourceElement, targetValue, {
        ...defaultOptions,
        ...options,
      });

      activeEffectRef.current = controls;
      controls.finished.finally(() => {
        if (activeEffectRef.current === controls) {
          activeEffectRef.current = null;
        }
      });

      return controls;
    },
    [defaultOptions],
  );

  return {
    cancel,
    run,
  };
}
