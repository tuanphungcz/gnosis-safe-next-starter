# Gnosis safe next starter

Gnosis safe starter with Ethers, Wagmi, Nextjs and TailwindCSS. [Live preview](https://gnosis-safe-next-starter.vercel.app/) app is using the Etherium Goerli test network.

## Goerli Faucet

You can request test ETH using [Goerli alchemy faucet](https://goerlifaucet.com/)

## Demo

https://user-images.githubusercontent.com/16448321/201672669-62221da3-f346-42f3-b261-bbfaf5c4145f.mp4

## Features

- The user is be able to connect their wallet (metamask)
- The user is be able to create a new safe with multiple owners and specific threshold
- The user is be able to see a list of his safes
- The user is be able to transfer some ERC20 tokens to the safe
- The user is be able to propose an ERC20 transfer transaction
- The user is be able to accept and execute the transaction

## Tech stack

- [Wagmi](https://github.com/wagmi-dev/wagmi) - Web3 interaction
- [Gnosis-sdk](https://github.com/safe-global/safe-core-sdk) - Gnosis multi-sig
- [Ethers.js](https://github.com/ethers-io/ethers.js/) - Wallet utilities
- [Vercel](https://vercel.com) - Deployment
- [Next.js](https://nextjs.org/), [Typescript](https://www.typescriptlang.org/) - React
- [Tailwind CSS](https://tailwindcss.com/) - Stylings

## Project overview

- `components/*` - Components used throughout the site.
- `layouts/*` - The different layouts used on each page.
- `utils/*` - Short for "utilities", a collection of helpful utilities
- `pages/*` - All the pages.
- `public/*` - Static assets including images, fonts, and videos.
- `styles/*` - global styles and Tailwind.

## Running locally

```bash
git clone https://github.com/tuanphungcz/gnosis-safe-next-starter
cd gnosis-safe-next-starter
npm install
npm run dev
```

## Todo

- [ ] add loading/pending states
- [ ] handle error state (at the moment, you can check the errors in the metamask)

## Resources

- [Gnosis Guide](https://github.com/safe-global/safe-core-sdk/blob/main/guides/integrating-the-safe-core-sdk.md#confirm-transaction)
- [Gnosis API](https://safe-transaction-goerli.safe.global/)
- [Gnosis service client API](https://github.com/safe-global/safe-core-sdk/tree/main/packages/safe-service-client#api-reference)
- [Gnosis Safe Starter Kit](https://github.com/scaffold-eth/scaffold-eth/tree/gnosis-starter-kit)
