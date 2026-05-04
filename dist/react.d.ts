import { type RefObject } from "react";
import { type GenieEffectControls, type GenieEffectOptions, type GenieTarget } from "./index.js";
type MaybeRef<T> = RefObject<T | null> | T | null | undefined;
export declare function useGenieEffect(defaultOptions?: GenieEffectOptions): {
    cancel: () => void;
    run: (source: MaybeRef<HTMLElement>, target: MaybeRef<GenieTarget>, options?: GenieEffectOptions) => GenieEffectControls | null;
};
export {};
