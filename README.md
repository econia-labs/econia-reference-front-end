# econia-reference-front-end

This repo serves as a reference for interacting with the Econia protocol via Typescript / React. The patterns used here are mainly built on top of Hippo's [move-to-ts library](https://github.com/hippospace/move-to-ts).

## Getting Started

You will need [NodeJS](https://nodejs.org/en/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install).

Install npm dependencies

```
yarn
```

Start the app locally on localhost:3000

```
yarn start
```

Build the app for production

```
yarn build
```

## Customization

There are two main customizations.

1. If the `@econia` address is different from the one generated in `src/sdk`, you will likely want to regenerate `src/sdk` for that `@econia` address OR edit the constant directly in `src/constants`. Don't forget to update `ECONIA_SIMULATION_KEYS` and `ORDER_BOOKS_ADDR` (the `@econia` resource account).
2. You will likely want to change `INTEGRATOR_ADDR` so that you can receive a portion of the taker fees.

## Project organization

A good starting point is to look at `src/AppRoutes.tsx`. This file will take you to each page on the app. You can also find all the pages under the `src/pages` directory.

If you are looking for something more specific, here is a more granular breakdown:

- `src/assets` contains logos / icons
- `src/components` contains common components like buttons, dropdowns, inputs...
- `src/hooks` contains many async IO functionality. Many of these hooks fetch on-chain data and send transactions.
- `src/layout` contains common UI wrappers
- `src/pages` contains each page of the app
- `src/sdk` contains [move-to-ts](https://github.com/hippospace/move-to-ts) generated code for [econia](https://github.com/econia-labs/econia), [econia-wrappers](https://github.com/econia-labs/econia-wrappers), and aptos-faucet
- `src/types` contains custom Typescript declarations and common types
- `src/utils` contains common utilities
