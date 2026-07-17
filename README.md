# Dream Physics — Interactive Field Manual

An artistic, responsive React/Vite app for **Dream Physics: A Field Manual of the Sleeping Cosmos**.

The app includes:

- the complete fifteen-chapter textbook and appendix;
- a unique WebGL visual law and glyph alphabet for every chapter;
- a searchable concept and phenomena Symbolarium;
- an interactive scene-stability laboratory;
- a prompt oracle drawn from the original structured source data;
- calm/reduced-motion and non-WebGL fallbacks;
- deep-linkable chapter routes.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Sources

- `source-material/Dream Physics Textbook.txt` — supplied manuscript preserved intact.
- `src/content/chapters/` — chapter Markdown from [`merrypranxter/dream_physics`](https://github.com/merrypranxter/dream_physics).
- `src/content/data/` — structured concept, phenomena, and prompt data from the same source repository.
