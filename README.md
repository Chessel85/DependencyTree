# Dependency Tree

A web application that shows inventions, historical moments and other developments, together with what each one depended on. It is inspired by the question "Why did it take so long to build an iPhone?"

It is designed from the start to be fully usable with a screen reader, as well as visually.

## Documents

- [Requirements Catalogue](docs/requirements-catalogue.md)
- [Functional Specification](docs/functional-specification.md)
- [Implementation Plan](docs/implementation-plan.md)

HTML versions are built from the Markdown with `docs/build.ps1`, which uses pandoc.

## Running it

You need Node.js. In the project folder:

1. `npm install`, once, to fetch the tools.
2. `npm run dev`, then open http://localhost:5173 in a browser.
3. `npm test` runs the unit tests.

## Licences

- Code: GNU Affero General Public License, version 3. See [LICENSE](LICENSE).
- Data: CC0 1.0 (public domain dedication).
