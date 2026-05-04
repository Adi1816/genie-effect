# Getting Started

Genie Effect gives you a macOS-style minimize animation for web interfaces. It
is useful for browser OS shells, dashboards, floating panels, docked tools,
command centers, and any UI where an element should visually collapse into a
button or icon.

## Install

```bash
npm install @adi1816/genie-effect
```

Import the CSS once near your app root:

```ts
import "@adi1816/genie-effect/styles.css";
```

## Choose an API

Use the React hook if your app is React-based:

```tsx
import { useGenieEffect } from "@adi1816/genie-effect/react";
```

Use the DOM function if you are working with plain JavaScript, another
framework, or direct element references:

```ts
import { runGenieEffect } from "@adi1816/genie-effect";
```

## Mental Model

Every animation needs two things:

- `source`: the element that should collapse
- `target`: the element or rectangle it should collapse into

The package temporarily hides the source element, creates one visual clone,
animates that clone into the target, removes the clone, then restores the
source element styles unless you opt out for minimize-then-unmount flows.

## Basic Flow

1. Keep a reference to the source element.
2. Keep a reference to the target button, dock icon, or nav control.
3. Run the animation.
4. Hide or unmount your source element in `onComplete`.

```ts
const controls = runGenieEffect(source, target, {
  restoreSourceOnComplete: false,
  onComplete: () => {
    source.hidden = true;
  },
});

await controls.finished;
```

If your app does not hide or unmount the source in `onComplete`, leave
`restoreSourceOnComplete` unset so the source is restored after the effect.

## Theme Inheritance

If the source element uses CSS variables, theme classes, custom fonts, or glass
effects from an app shell, add `data-genie-root` to that shell:

```tsx
<div data-genie-root className="app-shell">
  <YourWindow />
</div>
```

The temporary layer is mounted inside that root, so the clone inherits the same
visual environment.

## Good Defaults

Start with:

```ts
{
  duration: 860,
  direction: "auto"
}
```

Then tune the duration slightly depending on your interface. Smaller utility
panels often feel good around `650-760ms`; larger desktop windows usually feel
better around `820-940ms`.
