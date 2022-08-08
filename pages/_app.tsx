import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import 'styles/globals.css';
import { WagmiConfig, createClient, defaultChains, configureChains } from 'wagmi';

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io)
const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  alchemyProvider({ apiKey: 'yg_blwdfJFZL3aFZfYRBoDeDBsPPis8p' }),
  publicProvider()
]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains })
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'wagmi',
    //   },
    // }),
    // new WalletConnectConnector({
    //   chains,
    //   options: {
    //     qrcode: true,
    //   },
    // }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  provider,
  webSocketProvider
});

export default function App({ Component, pageProps }: any) {
  return (
    <>
      <WagmiConfig client={client}>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <title>Gnosis next starter</title>
          {process.env.NEXT_PUBLIC_UMAMI_ID && (
            <script
              defer
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
              src="https://umami-nu.vercel.app/umami.js"
            />
          )}
        </Head>
        <Toaster />
        <Component {...pageProps} />
      </WagmiConfig>
    </>
  );
}
