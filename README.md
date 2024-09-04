# Momentum Coalition Compass

![Screen video auf application](public/preview.gif)

Made by [Christian Cito](https://chrcit.com) / [Arthouse](https://madebyarthouse.com) in collaboration with [Momentum Institut](https://momentum-institut.at).

Application for analysing and visualizing data from the political questionnaire [wahlkabine.at](https://wahlkabine.at).

## Stack

- Vite
- React
- `chart.js` + `chartjs-chart-venn`
- Tailwind
- Framer Motion

## Data

The data was manually extracted from the [wahlkabine.at](https://wahlkabine.at) website.
It is then pre-processed and stored in the `src/wahlkabine-data/data-minimal.json` file.

## Development

```bash
# dev
npm run dev
```

```bash
# build
npm run build
```

```bash
# build widget
npm run build:lib
```

```bash
# pre-process data
npm run process-data
```

## Deployment

This is a pure client-side application and can be deployed to any (static) hosting service.

## License

Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.

See [LICENSE](./LICENSE.md)
