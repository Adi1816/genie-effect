# Performance Notes

Genie Effect is intentionally built around one cloned visual panel.

The first prototype used many horizontal DOM slices to imitate a true mesh
deformation. That looked closer mathematically, but it lagged in real browser
interfaces because every slice cloned the full source window. Large React
trees, iframes, charts, and glass panels made that approach expensive.

This package uses a production-friendly model:

- one source clone
- one temporary animation layer
- one animated panel
- a curved `clip-path` polygon
- `requestAnimationFrame`
- cleanup after completion

## What Makes It Smooth

The source element is cloned once, then the clone is visually transformed inside
a masked panel. The animation updates `transform`, `width`, `height`, `opacity`,
and `clip-path`.

The package also hides pointer events on the animation layer, so it does not
block interaction while the animation is running.

## Recommended Usage

Keep the animated source reasonably bounded. The effect is best for:

- app windows
- modal panels
- command palettes
- dashboards
- floating cards
- browser OS windows

Avoid using it on full-page documents with very large images, huge tables, or
deep embedded media if you need perfect 60fps on low-end devices.

## Iframes and Heavy Content

The source clone can contain iframes and rich UI, but browser iframe rendering
costs are outside the package's control. For the smoothest result, consider
showing a lightweight window surface around heavy iframe content during the
minimize action.

## Reduced Motion

By default, the package respects:

```css
@media (prefers-reduced-motion: reduce)
```

When reduced motion is enabled, the duration becomes short enough to avoid a
large sweeping movement while still keeping the UI state understandable.

You can override this behavior:

```ts
runGenieEffect(source, target, {
  reducedMotion: true,
});
```

## Tuning Duration

Good starting points:

- small panel: `650-760ms`
- regular app window: `820-940ms`
- dramatic OS-style minimize: `900-1050ms`

Very short durations can make the curve feel abrupt. Very long durations can
make the interface feel slow.
