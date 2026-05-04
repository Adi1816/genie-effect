# Examples

## Run the Included Demo

```bash
npm install
npm run demo
```

The demo lives in `examples/react-demo` and shows:

- minimizing into a dock button
- minimizing into a top navigation button
- restoring a hidden window
- using `data-genie-root`

## React: Minimize to Dock

```tsx
const windowRef = useRef<HTMLDivElement>(null);
const dockRef = useRef<HTMLButtonElement>(null);
const genie = useGenieEffect({ duration: 860 });

function minimize() {
genie.run(windowRef, dockRef, {
  restoreSourceOnComplete: false,
  onComplete: () => setOpen(false),
});
}
```

## React: Minimize to a Navbar Button

```tsx
const windowRef = useRef<HTMLDivElement>(null);
const commandButtonRef = useRef<HTMLButtonElement>(null);

genie.run(windowRef, commandButtonRef, {
  direction: "up",
  restoreSourceOnComplete: false,
  onComplete: () => setOpen(false),
});
```

## Vanilla: Minimize a Floating Panel

```ts
const panel = document.querySelector(".floating-panel") as HTMLElement;
const launcher = document.querySelector(".launcher") as HTMLElement;

runGenieEffect(panel, launcher, {
  duration: 760,
  restoreSourceOnComplete: false,
  onComplete: () => panel.classList.add("is-hidden"),
});
```

## Custom Target Rectangle

```ts
const dockRect = {
  left: 24,
  top: window.innerHeight - 72,
  width: 56,
  height: 56,
};

runGenieEffect(source, dockRect);
```

## Reduced Motion Override

```ts
runGenieEffect(source, target, {
  reducedMotion: true,
});
```

This forces the short reduced-motion path even if the operating system setting
does not request reduced motion.

## Custom Layer Styling

```ts
runGenieEffect(source, target, {
  className: "my-genie-layer",
});
```

```css
.my-genie-layer {
  z-index: 999999;
}
```
