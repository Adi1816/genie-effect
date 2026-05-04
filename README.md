# Genie Effect

A fast macOS-style genie minimize effect for React and vanilla DOM apps.

Genie Effect was born inside a browser-based operating system UI, where windows
needed to minimize into dock buttons with a premium pull while staying smooth
around dashboards, iframes, glass panels, and rich React components.

## Highlights

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

Import the styles once in your app:

```ts
import "@adi1816/genie-effect/styles.css";
```

## Quick React Usage

```tsx
import { useRef, useState } from "react";
import { useGenieEffect } from "@adi1816/genie-effect/react";
import "@adi1816/genie-effect/styles.css";

export function DemoWindow() {
  const [isVisible, setIsVisible] = useState(true);
  const windowRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLButtonElement>(null);
  const genie = useGenieEffect({ duration: 860 });

  function minimize() {
    genie.run(windowRef, dockRef, {
      restoreSourceOnComplete: false,
      onComplete: () => setIsVisible(false),
    });
  }

  return (
    <main data-genie-root>
      {isVisible ? (
        <section ref={windowRef} className="window">
          <button onClick={minimize}>Minimize</button>
          <h1>Workspace</h1>
        </section>
      ) : null}

      <button ref={dockRef} onClick={() => setIsVisible(true)}>
        App
      </button>
    </main>
  );
}
```

## Quick Vanilla Usage

```ts
import { runGenieEffect } from "@adi1816/genie-effect";
import "@adi1816/genie-effect/styles.css";

const source = document.querySelector("#window") as HTMLElement;
const target = document.querySelector("#dock-icon") as HTMLElement;

const controls = runGenieEffect(source, target, {
  duration: 860,
  restoreSourceOnComplete: false,
  onComplete: () => {
    source.hidden = true;
  },
});

await controls.finished;
```

## Documentation

- [Getting Started](./docs/getting-started.md)
- [React Guide](./docs/react.md)
- [Vanilla DOM Guide](./docs/vanilla.md)
- [API Reference](./docs/api-reference.md)
- [Examples](./docs/examples.md)
- [Performance Notes](./docs/performance.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Contributing](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## Demo App

The repo includes a small Vite demo:

```bash
npm install
npm run demo
```

## How It Works

The effect creates one temporary visual layer, clones the source element once,
then animates a curved `clip-path` polygon and panel transform with
`requestAnimationFrame`. This avoids the lag caused by cloning many horizontal
DOM slices while still giving the minimize motion a real genie-like pull.

If your source element depends on CSS variables from a shell, wrap the UI with
`data-genie-root`. The temporary layer will mount there and inherit your theme.

```tsx
<div data-genie-root className="app-shell">
  <YourWindow />
</div>
```

## Maintainer Release Checklist

```bash
npm install
npm run typecheck
npm run build
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
