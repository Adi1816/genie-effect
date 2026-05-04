# React Guide

Use `useGenieEffect` when your source and target are React refs.

```tsx
import { useRef, useState } from "react";
import { useGenieEffect } from "@adi1816/genie-effect/react";
import "@adi1816/genie-effect/styles.css";

export function WindowExample() {
  const [open, setOpen] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLButtonElement>(null);
  const genie = useGenieEffect({ duration: 860 });

  function minimize() {
    genie.run(windowRef, dockRef, {
      onComplete: () => setOpen(false),
    });
  }

  return (
    <main data-genie-root>
      {open ? (
        <section ref={windowRef}>
          <button onClick={minimize}>Minimize</button>
        </section>
      ) : null}

      <button ref={dockRef} onClick={() => setOpen(true)}>
        Restore
      </button>
    </main>
  );
}
```

## API

```ts
const { run, cancel } = useGenieEffect(defaultOptions);
```

`run(source, target, options)` accepts refs, elements, DOMRects, or plain
rectangles:

```ts
run(sourceRef, targetRef);
run(sourceRef, targetElement);
run(sourceRef, new DOMRect(24, 620, 64, 64));
run(sourceRef, { left: 24, top: 620, width: 64, height: 64 });
```

## Minimize Then Unmount

The cleanest React pattern is to keep the source mounted while the animation is
running and unmount it in `onComplete`.

```tsx
genie.run(windowRef, dockRef, {
  onComplete: () => setOpen(false),
});
```

If you unmount the source before running the effect, there is nothing left to
clone.

## Cancelling an Animation

Call `cancel()` when a window closes, route changes, or a competing animation
starts.

```tsx
genie.cancel();
```

Cancelling resolves the `finished` promise and fires `onCancel`, but it does not
fire `onComplete`.

## Multiple Windows

Create one hook per component or one hook in your shell controller. Before a new
animation starts, the hook cancels the previous active effect created by that
hook.

```tsx
const genie = useGenieEffect({ duration: 820 });
```

For a window manager, keep source refs in your window component and target refs
in your dock/taskbar component, then pass both into the shell action that calls
`run`.

## SSR Notes

`useGenieEffect` is client-side behavior. In Next.js App Router, put it inside a
Client Component:

```tsx
"use client";
```

The core function safely returns a resolved control object if called where
`window` is unavailable, but the visual effect only runs in the browser.
