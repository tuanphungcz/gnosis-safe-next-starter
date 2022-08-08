import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="robots" content="follow, index" />
        <meta
          name="description"
          content="Gnosis safe starter with Ethers, Wagmi, Nextjs and TailwindCSS"
        />

        <meta
          name="twitter:description"
          content="Gnosis safe starter with Ethers, Wagmi, Nextjs and TailwindCSS"
        />
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
