# CashClowns Remotion

Video animation and creation project built with [Remotion](https://www.remotion.dev/).

## Setup

```bash
cd remotion
npm install
```

## Develop

Open the Remotion Studio (live preview, edit props in browser):

```bash
npm run dev
```

## Render a video

```bash
npm run build -- HelloWorld out/HelloWorld.mp4
```

The first argument is the composition `id` defined in `src/Root.tsx`. Add new
compositions there.

## Project layout

- `src/index.ts` — entry point, registers the root component
- `src/Root.tsx` — declares all video compositions
- `src/HelloWorld.tsx` — example animated composition
- `remotion.config.ts` — render/encoding configuration

## Upgrade Remotion

```bash
npm run upgrade
```

## Notes

Remotion requires a Remotion license for some commercial use cases — see
<https://www.remotion.dev/license>.
