import { PrimaryButton } from 'components/base/Button';
import Layout from 'layouts/Layout';
import ProposeAndTransactions from 'components/ProposeAndTransactions';
import SafeListItem from 'components/SafeListItem';
import useSafeSdk from 'hooks/useSafeSdk';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAccount, useSigner } from 'wagmi';

function Index() {
  const { address, isConnected } = useAccount();
  const { data: signer } = useSigner();
  const [walletSafes, setWalletSafes] = useState([]);
  const [currentSafeWallet, setCurrentSafeWallet] = useState();

  const { safeService }: any = useSafeSdk(signer, null);

  const fetchData = async () => {
    const { safes } = await safeService.getSafesByOwner(address);
    setWalletSafes(safes);
  };
  useEffect(() => {
    if (safeService && isConnected) {
      fetchData();
    }
  }, [address, safeService, isConnected]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="py-8 border-b md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Gnosis Safe list
            </h3>
            <p className="mt-2 text-sm text-gray-500"> Here is a list of your safes</p>
          </div>
          <Link href="/create-safe">
            <PrimaryButton>Create safe</PrimaryButton>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {walletSafes.map((address, i) => {
            return (
              <SafeListItem
                key={address + i}
                address={address}
                setCurrentSafeWallet={setCurrentSafeWallet}
                safeAddress={currentSafeWallet}
              />
            );
          })}
        </div>
      </div>
      {currentSafeWallet && <ProposeAndTransactions safeAddress={currentSafeWallet} />}
    </Layout>
  );
}

export default Index;
