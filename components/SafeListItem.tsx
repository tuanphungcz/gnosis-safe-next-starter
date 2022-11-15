import Link from 'next/link';
import { useBalance } from 'wagmi';
import {  SecondaryButton } from './base/Button';

const SafeListItem = ({ address, setCurrentSafeWallet, safeAddress }) => {
  const { data } = useBalance({
    address
  });

  console.log(data)

  return (
    <div key={address} onClick={() => setCurrentSafeWallet(address)}>
      <div
        className={`relative flex items-center space-x-3 rounded-lg group border  cursor-pointer bg-white px-6 py-5 hover:border-gray-400 ${
          address === safeAddress ? ' border-gray-500' : 'border-gray-300'
        }`}
      >
        <div className="h-10 w-10 rounded-full bg-gray-100" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{address}</p>
          <p className="truncate text-sm text-gray-500">{data?.formatted} ETH</p>
        </div>
        <Link href={`/send-token/${address}`}>
          <div className="group-hover:block hidden">
            <SecondaryButton>Send token</SecondaryButton>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SafeListItem;
