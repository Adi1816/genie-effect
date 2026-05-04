# Troubleshooting

## The Animation Does Not Show

Check that the CSS is imported once:

```ts
import "@adi1816/genie-effect/styles.css";
```

Also make sure both source and target exist when `runGenieEffect` is called.

## The Source Disappears Too Early

Do not unmount or hide the source before starting the animation. Let Genie
Effect clone it first, then hide or unmount it in `onComplete`.

```ts
genie.run(sourceRef, targetRef, {
  onComplete: () => setOpen(false),
});
```

## The Clone Has the Wrong Theme

Wrap your shell with `data-genie-root`:

```tsx
<div data-genie-root className="app-shell">
  <YourWindow />
</div>
```

This helps the cloned visual panel inherit CSS variables, fonts, theme classes,
and glass styles.

You can also pass `layerParent` manually:

```ts
runGenieEffect(source, target, {
  layerParent: document.querySelector(".app-shell") as HTMLElement,
});
```

## The Effect Appears Behind Other UI

The layer tries to reuse the source element's computed `z-index`. If your app
has a complex stacking context, pass a custom class and set the z-index:

```ts
runGenieEffect(source, target, {
  className: "my-genie-layer",
});
```

```css
.my-genie-layer {
  z-index: 2147483000;
}
```

## The Animation Feels Too Sharp

Increase the duration slightly:

```ts
runGenieEffect(source, target, {
  duration: 920,
});
```

Large desktop-style windows usually need a bit more time than small cards.

## React Returns `null`

`useGenieEffect().run(...)` returns `null` when it cannot resolve the source or
target. Confirm your refs are attached to real DOM elements:

```tsx
const sourceRef = useRef<HTMLDivElement>(null);
const targetRef = useRef<HTMLButtonElement>(null);
```

Then pass the refs after both elements are mounted.

## Next.js App Router Error

Use the hook inside a Client Component:

```tsx
"use client";
```

The visual animation needs the browser DOM.
