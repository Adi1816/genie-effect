# Contributing

Thanks for wanting to improve Genie Effect.

This package is intentionally small. Contributions should keep the core API
simple, dependency-light, and smooth on real app UIs.

## Local Setup

```bash
git clone https://github.com/Adi1816/genie-effect.git
cd genie-effect
npm install
npm run typecheck
npm run build
```

Run the demo:

```bash
npm run demo
```

## Project Structure

```text
src/
  index.ts       Core DOM animation API
  react.ts       React hook wrapper
  styles.css     Required runtime styles
dist/            Built package output
docs/            Usage and maintenance docs
examples/        Demo applications
```

## Development Rules

- Keep the core DOM API framework-agnostic.
- Do not add runtime dependencies unless there is a strong reason.
- Keep React as a peer dependency only.
- Preserve `prefers-reduced-motion` support.
- Test changes with both the React hook and the vanilla DOM API.
- Keep generated output in `dist` updated before publishing.

## Before Opening a PR

```bash
npm run typecheck
npm run build
npm pack --dry-run
```

## Release Process

Only maintainers should publish releases.

```bash
npm version patch
npm publish --access public
git push --follow-tags
```

Use `minor` for new public features and `major` for breaking API changes.
