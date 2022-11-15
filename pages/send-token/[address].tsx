import { PrimaryButton } from 'components/base/Button';
import Card from 'components/base/Card';
import { Input } from 'components/base/Form';
import { parseEther } from 'ethers/lib/utils.js';
import Layout from 'layouts/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';
import { useDebounce } from 'use-debounce';
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction
} from 'wagmi';

export default function SendTransaction() {
  const {
    query: { address }
  } = useRouter();
  const [to, setTo] = React.useState(address as string);
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = React.useState('0.1');
  const [debouncedValue] = useDebounce(amount, 500);

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedValue ? parseEther(debouncedValue) : undefined
    }
  });
  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash
  });

  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-8">
        <Card>
          <form
            className="p-8"
            onSubmit={e => {
              e.preventDefault();
              sendTransaction?.();
            }}
          >
            <div className="text-xl font-semibold mb-2">Transfer token</div>
            <Input
              label="Recipient"
              onChange={e => setTo(e.target.value)}
              placeholder="0xA0Cf…251e"
              value={to}
            />
            <Input
              label="Amount (ether)"
              onChange={e => setAmount(e.target.value)}
              placeholder="0.1"
              value={amount}
            />
            <PrimaryButton disabled={isLoading || !sendTransaction || !to || !amount}>
              {isLoading ? 'Sending...' : 'Send token'}
            </PrimaryButton>
            {isSuccess && (
              <div className="text-xs mt-4 text-gray-600">
                Successfully sent {amount} ether to {to}
                <div>
                  <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
                </div>
                <Link href="/">
                  <div className="mt-4 font-semibold hover:underline">
                    Please go back to the list of safes by clicking here
                  </div>
                </Link>
              </div>
            )}
          </form>
        </Card>
      </div>
    </Layout>
  );
}
