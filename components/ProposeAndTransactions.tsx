import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useAccount, useSigner } from 'wagmi';
import toast from 'react-hot-toast';
import usePoll from 'hooks/usePoll';
import { EthSignSignature } from '@gnosis.pm/safe-core-sdk';
import ContractInteractionButton from './ContractInteractionButton';
import Card from './base/Card';
import { Input } from './base/Form';
import { PrimaryButton } from './base/Button';
import useSafeSdk from 'hooks/useSafeSdk';

export default function ProposeAndTransactions({ safeAddress }) {
  const [to, setTo] = useState('');
  const [threshold, setThreshold] = useState(0);
  const [owners, setOwners] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [value, setValue] = useState(0);
  const [safeInfo, setSafeInfo]: any = useState();

  const { data: signer } = useSigner();
  const { address } = useAccount();
  const { safeSdk, safeService }: any = useSafeSdk(signer, safeAddress);

  const proposeSafeTransaction = async transaction => {
    if (!safeSdk || !safeService || !safeService) {
      return null;
    }
    try {
      const safeTransaction = await safeSdk.createTransaction({
        safeTransactionData: transaction
      });

      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
      const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
      await safeService.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderSignature: senderSignature.data,
        senderAddress: address
      });
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const confirmTransaction = async transaction => {
    if (!safeSdk || !safeService || !safeService) {
      return null;
    }
    const hash = transaction.safeTxHash;
    try {
      const signature = await safeSdk.signTransactionHash(hash);
      await safeService.confirmTransaction(hash, signature.data);
    } catch (error) {
      console.error(error);
      return;
    }
  };

  const executeSafeTransaction = async transaction => {
    if (!safeSdk) {
      return null;
    }

    const safeTransactionData = {
      to: transaction.to,
      value: transaction.value,
      data: transaction.data || '0x',
      operation: transaction.operation,
      safeTxGas: transaction.safeTxGas,
      baseGas: transaction.baseGas,
      gasPrice: transaction.gasPrice,
      gasToken: transaction.gasToken,
      refundReceiver: transaction.refundReceiver,
      nonce: transaction.nonce
    };
    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData });

    transaction.confirmations.forEach(confirmation => {
      const signature = new EthSignSignature(confirmation.owner, confirmation.signature);
      safeTransaction.addSignature(signature);
    });
    try {
      const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);

      const receipt =
        executeTxResponse.transactionResponse &&
        (await executeTxResponse.transactionResponse.wait());

      console.log(receipt);
    } catch (error) {
      console.error(error);
      return;
    }
  };
  const fetchData = async (safeAddress, safeSdk, safeService) => {
    if (safeAddress) {
      try {
        if (safeSdk && safeService) {
          const [owners, threshold, safeInfo, transactions] = await Promise.all([
            await safeSdk.getOwners(),
            await safeSdk.getThreshold(),
            await safeService.getSafeInfo(safeAddress),
            await safeService.getPendingTransactions(safeAddress)
          ]);
          setOwners(owners);
          setThreshold(threshold);
          setSafeInfo(safeInfo);
          setTransactions(transactions.results);
        }
      } catch (e) {
        console.log('ERROR POLLING FROM SAFE:', e);
      }
    }
  };

  const onTransactionSign = async () => {
    const checksumForm = ethers.utils.getAddress(to);
    const partialTx = {
      to: checksumForm,
      data: '0x00',
      value: ethers.utils.parseEther(value ? value.toString() : '0').toString()
    };
    try {
      await proposeSafeTransaction(partialTx);
    } catch (e) {
      console.log('🛑 Error Proposing Transaction', e);
      toast.error('Error Proposing Transaction');
    }
  };

  usePoll(() => {
    fetchData(safeAddress, safeSdk, safeService);
  }, [safeAddress, safeSdk, safeService]);

  useEffect(() => {
    fetchData(safeAddress, safeSdk, safeService);
  }, [safeAddress, safeSdk, safeService]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-8">
      {safeInfo && (
        <Card>
          <div className="p-8 border-b md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Selected safe info
            </h3>
            <p className="mt-2 text-sm text-gray-500">Address: {safeAddress}</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 mb-4 p-8">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Threshold</dt>
              <dd className="mt-1 text-sm text-gray-900">{safeInfo.threshold}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Number of owners </dt>
              <dd className="mt-1 text-sm text-gray-900">{safeInfo.owners.length}</dd>
            </div>

            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">List of owners </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {safeInfo.owners.map(owner => (
                  <div key={owner}>{owner}</div>
                ))}
              </dd>
            </div>
          </dl>
        </Card>
      )}
      {transactions?.length > 0 && (
        <Card>
          <div className="p-8 border-b md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Transaction queue {transactions?.length > 0 && `(${transactions?.length})`}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Transactions waiting to be signed
            </p>
          </div>
          {transactions?.map(transaction => {
            const buttonProps = {
              owners,
              confirmTransaction,
              transaction,
              executeSafeTransaction,
              threshold
            };

            return (
              <div className="p-8 border-b md:col-span-2" key={transaction.id}>
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Contract interaction
                </h3>

                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 mb-4">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Value</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {ethers.utils.formatEther(transaction.value)} ETH
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Send to</dt>
                    <dd className="mt-1 text-sm text-gray-900">{transaction.to}</dd>
                  </div>
                </dl>

                <ContractInteractionButton {...buttonProps} />
              </div>
            );
          })}
        </Card>
      )}

      {owners.includes(address) && safeAddress?.length > 0 && (
        <Card>
          <div className="p-8 border-b md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Propose Transaction
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              You can add socials like LinkedIn, Github, Twitter, and your personal
              website
            </p>
          </div>
          <div className="p-8 mt-5 border-b md:mt-0 md:col-span-2 grid grid-1 gap-4">
            <Input
              placeholder="Enter To Address"
              onChange={e => setTo(e.target.value)}
              value={to}
              label="ETH address"
            />

            <Input
              placeholder="Enter Tx Value"
              value={value}
              label="ETH amount"
              onChange={e => setValue(e.target.value)}
              prefix={'Ξ'}
            />
            <div className="inline-block">
              <PrimaryButton onClick={onTransactionSign}>Sign Transaction</PrimaryButton>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
