export type GenieDirection = "auto" | "up" | "down";
export type GenieRect = {
    left: number;
    top: number;
    width: number;
    height: number;
    right?: number;
    bottom?: number;
};
export type GenieTarget = HTMLElement | DOMRect | GenieRect;
export type GenieEffectOptions = {
    duration?: number;
    direction?: GenieDirection;
    layerParent?: HTMLElement;
    className?: string;
    hideSource?: boolean;
    reducedMotion?: boolean;
    onStart?: () => void;
    onUpdate?: (progress: number) => void;
    onComplete?: () => void;
    onCancel?: () => void;
};
export type GenieEffectControls = {
    cancel: () => void;
    finished: Promise<void>;
};
export declare function runGenieEffect(source: HTMLElement, target: GenieTarget, options?: GenieEffectOptions): GenieEffectControls;
