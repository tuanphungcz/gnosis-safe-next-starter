import { useAccount } from 'wagmi';
import { PrimaryButton } from './base/Button';

const ContractInteractionButton = ({
  owners,
  confirmTransaction,
  transaction,
  executeSafeTransaction,
  threshold
}) => {
  const { address } = useAccount();

  const isTransactionExecutable = transaction =>
    transaction.confirmations.length >= threshold;

  const isTransactionSignedByAddress = transaction => {
    const confirmation = transaction.confirmations.find(
      confirmation => confirmation.owner === address
    );
    return !!confirmation;
  };

  const isSafeOwnerConnected = owners.includes(address);

  if (!owners || owners.length <= 0) {
    return <div>Loading</div>;
  }

  if (
    !isTransactionExecutable(transaction) &&
    isSafeOwnerConnected &&
    !isTransactionSignedByAddress(transaction)
  ) {
    return (
      <PrimaryButton onClick={() => confirmTransaction(transaction)}>
        Sign TX
      </PrimaryButton>
    );
  }

  if (
    !isTransactionExecutable(transaction) &&
    isSafeOwnerConnected &&
    isTransactionSignedByAddress(transaction)
  ) {
    return (
      <span className="inline-flex items-center rounded-full bg-orange-100 px-3 py-0.5 text-sm font-medium text-orange-800">
        Waiting for more signatures...
      </span>
    );
  }

  if (isSafeOwnerConnected && isTransactionExecutable(transaction)) {
    return (
      <PrimaryButton onClick={() => executeSafeTransaction(transaction)}>
        Execute TX
      </PrimaryButton>
    );
  }

  if (!isSafeOwnerConnected && isTransactionExecutable(transaction)) {
    return <span> 'Waiting to execute...'</span>;
  }
};

export default ContractInteractionButton;
