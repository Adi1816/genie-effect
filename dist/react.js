import { useCallback, useRef } from "react";
import { runGenieEffect, } from "./index.js";
function resolveRef(value) {
    if (!value) {
        return null;
    }
    if (typeof value === "object" && "current" in value) {
        return value.current;
    }
    return value;
}
export function useGenieEffect(defaultOptions = {}) {
    const activeEffectRef = useRef(null);
    const cancel = useCallback(() => {
        activeEffectRef.current?.cancel();
        activeEffectRef.current = null;
    }, []);
    const run = useCallback((source, target, options = {}) => {
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
    }, [defaultOptions]);
    return {
        cancel,
        run,
    };
}
