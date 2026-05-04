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

type ResolvedMotion = {
  direction: Exclude<GenieDirection, "auto">;
  finalRect: DOMRect;
  initialRect: DOMRect;
};

type GenieLayer = {
  clone: HTMLElement;
  layer: HTMLElement;
  panel: HTMLElement;
};

const DEFAULT_DURATION = 860;
const SLIDE_END_FRACTION = 0.5;
const TRANSLATE_START_FRACTION = 0.4;
const GENIE_CURVE_ROWS = [0, 0.12, 0.25, 0.4, 0.58, 0.75, 0.88, 1];

function clampProgress(value: number) {
  return Math.min(Math.max(value, 0), 1);
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function easeInOutQuad(value: number) {
  return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
}

function isElementTarget(target: GenieTarget): target is HTMLElement {
  return (
    typeof target === "object" &&
    target !== null &&
    "getBoundingClientRect" in target &&
    typeof target.getBoundingClientRect === "function"
  );
}

function toDomRect(target: GenieTarget) {
  if (isElementTarget(target)) {
    return target.getBoundingClientRect();
  }

  if (typeof DOMRect !== "undefined" && target instanceof DOMRect) {
    return target;
  }

  return new DOMRect(target.left, target.top, target.width, target.height);
}

function resolveMotion(source: HTMLElement, target: GenieTarget, direction: GenieDirection) {
  const initialRect = source.getBoundingClientRect();
  const finalRect = toDomRect(target);
  const targetCenterY = finalRect.top + finalRect.height / 2;
  const sourceCenterY = initialRect.top + initialRect.height / 2;
  const resolvedDirection =
    direction === "auto" ? (targetCenterY < sourceCenterY ? "up" : "down") : direction;

  return {
    direction: resolvedDirection,
    finalRect,
    initialRect,
  } satisfies ResolvedMotion;
}

function screenY(axisY: number, direction: ResolvedMotion["direction"]) {
  return direction === "down" ? axisY : -axisY;
}

function getCurveRow(motion: ResolvedMotion, progress: number, rowProgress: number) {
  const { direction, finalRect, initialRect } = motion;
  const axisInitialFar = direction === "down" ? initialRect.top : -initialRect.bottom;
  const axisInitialNear = direction === "down" ? initialRect.bottom : -initialRect.top;
  const axisFinalFar = direction === "down" ? finalRect.top : -finalRect.bottom;
  const axisFinalNear = direction === "down" ? finalRect.bottom : -finalRect.top;
  const axisDistance = axisFinalFar - axisInitialFar;
  const slideProgress = easeOutCubic(clampProgress(progress / SLIDE_END_FRACTION));
  const translateProgress = easeInOutQuad(
    clampProgress((progress - TRANSLATE_START_FRACTION) / (1 - TRANSLATE_START_FRACTION)),
  );
  const translation = translateProgress * axisDistance;
  const farEdgeY = axisInitialFar + translation;
  const nearEdgeY = Math.min(axisInitialNear + translation, axisFinalNear);
  const farToNearProgress = direction === "down" ? rowProgress : 1 - rowProgress;
  const axisY = farEdgeY * (1 - farToNearProgress) + nearEdgeY * farToNearProgress;
  const curveProgress =
    axisDistance === 0
      ? 1
      : easeInOutQuad(clampProgress((axisY - axisInitialFar) / axisDistance));
  const leftTargetX = initialRect.left + (finalRect.left - initialRect.left) * slideProgress;
  const rightTargetX = initialRect.right + (finalRect.right - initialRect.right) * slideProgress;
  const leftX = initialRect.left + (leftTargetX - initialRect.left) * curveProgress;
  const rightX = initialRect.right + (rightTargetX - initialRect.right) * curveProgress;

  return {
    leftX,
    rightX,
    y: screenY(axisY, direction),
  };
}

function getGenieFrame(motion: ResolvedMotion, progress: number) {
  const rows = GENIE_CURVE_ROWS.map((rowProgress) =>
    getCurveRow(motion, progress, rowProgress),
  );
  const minX = Math.min(...rows.map((row) => row.leftX));
  const maxX = Math.max(...rows.map((row) => row.rightX));
  const minY = Math.min(...rows.map((row) => row.y));
  const maxY = Math.max(...rows.map((row) => row.y));
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const rightSide = rows.map((row) => `${row.rightX - minX}px ${row.y - minY}px`);
  const leftSide = [...rows]
    .reverse()
    .map((row) => `${row.leftX - minX}px ${row.y - minY}px`);

  return {
    clipPath: `polygon(${[...rightSide, ...leftSide].join(", ")})`,
    height,
    left: minX,
    top: minY,
    width,
  };
}

function prepareClone(source: HTMLElement, initialRect: DOMRect) {
  const clone = source.cloneNode(true) as HTMLElement;

  clone.removeAttribute("id");
  clone.removeAttribute("data-genie-source");
  clone.setAttribute("aria-hidden", "true");
  clone.style.animation = "none";
  clone.style.height = `${initialRect.height}px`;
  clone.style.left = "0";
  clone.style.margin = "0";
  clone.style.minHeight = "0";
  clone.style.minWidth = "0";
  clone.style.pointerEvents = "none";
  clone.style.position = "absolute";
  clone.style.top = "0";
  clone.style.transform = "none";
  clone.style.transformOrigin = "top left";
  clone.style.width = `${initialRect.width}px`;
  clone.style.zIndex = "auto";

  return clone;
}

function createLayer(source: HTMLElement, motion: ResolvedMotion, options: GenieEffectOptions) {
  const layer = document.createElement("div");
  const panel = document.createElement("div");
  const clone = prepareClone(source, motion.initialRect);
  const parent =
    options.layerParent ??
    source.closest<HTMLElement>("[data-genie-root]") ??
    document.body;

  layer.className = ["genie-effect-layer", options.className].filter(Boolean).join(" ");
  layer.style.zIndex = getComputedStyle(source).zIndex || "2147483000";

  panel.className = "genie-effect-panel";
  panel.style.height = `${motion.initialRect.height}px`;
  panel.style.transform = `translate3d(${motion.initialRect.left}px, ${motion.initialRect.top}px, 0)`;
  panel.style.width = `${motion.initialRect.width}px`;

  panel.appendChild(clone);
  layer.appendChild(panel);
  parent.appendChild(layer);

  return {
    clone,
    layer,
    panel,
  } satisfies GenieLayer;
}

function removeLayer(layer?: HTMLElement | null) {
  layer?.parentElement?.removeChild(layer);
}

function shouldReduceMotion(options: GenieEffectOptions) {
  if (typeof options.reducedMotion === "boolean") {
    return options.reducedMotion;
  }

  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function runGenieEffect(
  source: HTMLElement,
  target: GenieTarget,
  options: GenieEffectOptions = {},
): GenieEffectControls {
  if (typeof window === "undefined") {
    return {
      cancel: () => undefined,
      finished: Promise.resolve(),
    };
  }

  const duration = shouldReduceMotion(options) ? 80 : (options.duration ?? DEFAULT_DURATION);
  const motion = resolveMotion(source, target, options.direction ?? "auto");
  const layer = createLayer(source, motion, options);
  const originalOpacity = source.style.opacity;
  const originalPointerEvents = source.style.pointerEvents;
  let frameId: number | null = null;
  let isDone = false;
  let resolveFinished: () => void;
  const finished = new Promise<void>((resolve) => {
    resolveFinished = resolve;
  });

  const settle = (state: "complete" | "cancel") => {
    if (isDone) {
      return;
    }

    isDone = true;
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }

    removeLayer(layer.layer);
    source.style.opacity = originalOpacity;
    source.style.pointerEvents = originalPointerEvents;
    if (state === "complete") {
      options.onComplete?.();
    } else {
      options.onCancel?.();
    }
    resolveFinished();
  };

  if (options.hideSource !== false) {
    source.style.opacity = "0";
    source.style.pointerEvents = "none";
  }

  options.onStart?.();

  const startedAt = performance.now();
  const animate = (timestamp: number) => {
    const progress = clampProgress((timestamp - startedAt) / duration);
    const genieFrame = getGenieFrame(motion, progress);
    const scaleX = genieFrame.width / Math.max(motion.initialRect.width, 1);
    const scaleY = genieFrame.height / Math.max(motion.initialRect.height, 1);
    const fadeProgress = clampProgress((progress - 0.82) / 0.18);

    layer.panel.style.clipPath = genieFrame.clipPath;
    layer.panel.style.height = `${genieFrame.height}px`;
    layer.panel.style.opacity = `${1 - fadeProgress}`;
    layer.panel.style.transform = `translate3d(${genieFrame.left}px, ${genieFrame.top}px, 0)`;
    layer.panel.style.width = `${genieFrame.width}px`;
    layer.clone.style.transform = `scale(${scaleX}, ${scaleY})`;

    options.onUpdate?.(progress);

    if (progress < 1) {
      frameId = window.requestAnimationFrame(animate);
      return;
    }

    settle("complete");
  };

  frameId = window.requestAnimationFrame(animate);

  return {
    cancel: () => settle("cancel"),
    finished,
  };
}
