# Vanilla DOM Guide

Use `runGenieEffect` when you want direct control without React.

```ts
import { runGenieEffect } from "@adi1816/genie-effect";
import "@adi1816/genie-effect/styles.css";

const source = document.querySelector("#window") as HTMLElement;
const target = document.querySelector("#dock-icon") as HTMLElement;

runGenieEffect(source, target, {
  onComplete: () => {
    source.hidden = true;
  },
});
```

## Element Targets

The most common target is a dock icon or button.

```ts
const controls = runGenieEffect(panel, dockButton);
```

The target element is measured with `getBoundingClientRect()` when the animation
starts.

## Rectangle Targets

You can also pass a fixed rectangle:

```ts
runGenieEffect(panel, {
  left: 32,
  top: window.innerHeight - 84,
  width: 56,
  height: 56,
});
```

This is useful when the destination is virtual, canvas-based, or represented by
layout state instead of a real DOM node.

## Waiting for Completion

```ts
const controls = runGenieEffect(panel, target);

await controls.finished;
```

`finished` resolves after either completion or cancellation. Use `onComplete`
and `onCancel` to distinguish the two paths.

## Manual Cancellation

```ts
const controls = runGenieEffect(panel, target, {
  onCancel: () => console.log("Animation interrupted"),
});

controls.cancel();
```

## Custom Layer Parent

By default, the layer mounts inside the closest `[data-genie-root]` ancestor, or
`document.body` if no root exists.

```ts
runGenieEffect(panel, target, {
  layerParent: document.querySelector(".app-shell") as HTMLElement,
});
```

Use this when your app shell provides CSS variables, transforms, fonts, or theme
classes that the clone needs to inherit.
