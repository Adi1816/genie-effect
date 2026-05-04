# API Reference

## Exports

```ts
import { runGenieEffect } from "@adi1816/genie-effect";
import { useGenieEffect } from "@adi1816/genie-effect/react";
import "@adi1816/genie-effect/styles.css";
```

## `runGenieEffect(source, target, options?)`

Runs the genie animation from a source element into a target element or target
rectangle.

```ts
function runGenieEffect(
  source: HTMLElement,
  target: GenieTarget,
  options?: GenieEffectOptions,
): GenieEffectControls;
```

### `source`

The real element that should visually collapse. The package clones this element
once at animation start.

### `target`

```ts
type GenieTarget =
  | HTMLElement
  | DOMRect
  | {
      left: number;
      top: number;
      width: number;
      height: number;
      right?: number;
      bottom?: number;
    };
```

### `options`

```ts
type GenieEffectOptions = {
  duration?: number;
  direction?: "auto" | "up" | "down";
  layerParent?: HTMLElement;
  className?: string;
  hideSource?: boolean;
  reducedMotion?: boolean;
  onStart?: () => void;
  onUpdate?: (progress: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
};
```

`duration`

Animation duration in milliseconds. Default: `860`.

`direction`

Controls whether the target is treated as above or below the source. Default:
`"auto"`.

`layerParent`

Element that receives the temporary animation layer. By default, the layer uses
the closest `[data-genie-root]` ancestor or falls back to `document.body`.

`className`

Extra class added to the animation layer for advanced styling or debugging.

`hideSource`

Whether to hide the source during the animation. Default: `true`.

`reducedMotion`

Override for reduced motion. By default, the package reads
`prefers-reduced-motion`.

`onStart`

Called after the layer is created and before the first animation frame.

`onUpdate`

Called on every frame with normalized progress from `0` to `1`.

`onComplete`

Called when the animation reaches the target.

`onCancel`

Called when `cancel()` interrupts the animation.

### Return Value

```ts
type GenieEffectControls = {
  cancel: () => void;
  finished: Promise<void>;
};
```

`cancel()`

Stops the animation, removes the temporary layer, restores the source element,
fires `onCancel`, and resolves `finished`.

`finished`

Resolves after completion or cancellation.

## `useGenieEffect(defaultOptions?)`

React hook wrapper around `runGenieEffect`.

```ts
const { run, cancel } = useGenieEffect({ duration: 860 });
```

```ts
run(sourceRef, targetRef, {
  onComplete: () => setMinimized(true),
});
```

The hook accepts refs or direct values for source and target:

```ts
run(sourceRef, targetRef);
run(sourceRef, targetElement);
run(sourceRef, { left: 24, top: 640, width: 56, height: 56 });
```

`run` returns `GenieEffectControls | null`. It returns `null` if either the
source or target cannot be resolved.
