# Genie Effect

A fast macOS-style genie minimize effect for React and vanilla DOM apps.

This package was built from a practical browser OS use case: make a window minimize into a dock button with a premium macOS-inspired pull, without creating dozens of cloned DOM slices that lag on real dashboards, iframes, and rich UI.

## Features

- macOS-like genie minimize motion
- React hook and vanilla DOM API
- One lightweight cloned visual panel, not heavy slice cloning
- Curved `clip-path` silhouette
- Works with dock icons, nav buttons, floating controls, or custom target rects
- Respects `prefers-reduced-motion`
- TypeScript definitions included
- No runtime dependency for the core DOM API

## Install

```bash
npm install @adi1816/genie-effect
```

Import the styles once:

```ts
import "@adi1816/genie-effect/styles.css";
```

## React Usage

```tsx
import { useRef, useState } from "react";
import { useGenieEffect } from "@adi1816/genie-effect/react";
import "@adi1816/genie-effect/styles.css";

export function DemoWindow() {
  const [isVisible, setIsVisible] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLButtonElement>(null);
  const genie = useGenieEffect();

  async function minimize() {
    const controls = genie.run(windowRef, dockRef, {
      duration: 860,
      onComplete: () => setIsVisible(false),
    });

    await controls?.finished;
  }

  return (
    <main data-genie-root>
      {isVisible ? (
        <div ref={windowRef} className="window">
          <button onClick={minimize}>Minimize</button>
          <h1>Workspace</h1>
          <p>This panel will genie into the dock.</p>
        </div>
      ) : null}

      <button ref={dockRef} onClick={() => setIsVisible(true)}>
        App
      </button>
    </main>
  );
}
```

## Vanilla DOM Usage

```ts
import { runGenieEffect } from "@adi1816/genie-effect";
import "@adi1816/genie-effect/styles.css";

const source = document.querySelector("#window") as HTMLElement;
const target = document.querySelector("#dock-icon") as HTMLElement;

const controls = runGenieEffect(source, target, {
  duration: 860,
  onComplete: () => {
    source.hidden = true;
  },
});

await controls.finished;
```

## API

### `runGenieEffect(source, target, options)`

Runs the genie effect from a source element to a target element or rect.

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

Returns:

```ts
type GenieEffectControls = {
  cancel: () => void;
  finished: Promise<void>;
};
```

`cancel()` cleans up the temporary layer and resolves `finished` without firing
`onComplete`. Use `onCancel` if you need to respond to interrupted animations.

### `useGenieEffect(defaultOptions?)`

React hook wrapper around `runGenieEffect`.

```ts
const { run, cancel } = useGenieEffect({ duration: 860 });

run(sourceRef, targetRef, {
  onComplete: () => setMinimized(true),
});
```

## Theme Inheritance

If your source element depends on CSS variables from an app shell, add `data-genie-root` to the shell:

```tsx
<div data-genie-root className="app-shell">
  <YourWindow />
</div>
```

The temporary genie layer will be mounted inside that root, so the cloned visual panel inherits your colors, fonts, glass effects, and theme variables.

You can also pass an explicit parent:

```ts
runGenieEffect(source, target, {
  layerParent: document.querySelector(".app-shell") as HTMLElement,
});
```

## Performance Notes

The first prototype used many horizontal DOM slices to mimic the real macOS mesh deformation. It looked closer mathematically, but it lagged badly in real browser UI because every slice cloned the full window.

This package uses a production-friendly version:

- one visual clone
- one animated panel
- a curved `clip-path` polygon
- `requestAnimationFrame`
- cleanup after completion

That keeps the premium genie feel while staying smooth enough for portfolio OS windows, dashboards, and app shells.

## Publishing Checklist

1. Create an npm account at npmjs.com if you do not already have one.
2. Confirm the package name in `package.json`.
   - If your npm username is not `adi1816`, change the name to `@your-npm-username/genie-effect`.
   - Scoped public packages need `npm publish --access public`.
3. Create a GitHub repo, for example `Adi1816/genie-effect`.
4. Push this folder to GitHub.
5. Run:

```bash
npm install
npm run typecheck
npm run build
npm login
npm pack --dry-run
npm publish --access public
```

For future releases:

```bash
npm version patch
npm publish --access public
git push --follow-tags
```

## License

MIT
