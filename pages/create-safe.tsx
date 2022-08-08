import { SafeAccountConfig } from '@gnosis.pm/safe-core-sdk';
import { PrimaryButton, SecondaryButton } from 'components/base/Button';
import Card from 'components/base/Card';
import { Input } from 'components/base/Form';
import Layout from 'layouts/Layout';
import { ethers } from 'ethers';
import useSafeSdk from 'hooks/useSafeSdk';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount, useSigner } from 'wagmi';

export default function CreateSafe() {
  const { push } = useRouter();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const [inputList, setInputList]: any = useState([address]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const list = [...inputList];
    list[index] = value;
    setInputList(list);
  };

  const handleRemove = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...inputList, '']);
  };

  const [initThreshold, setInitThreshold] = useState(1);

  const { safeFactory }: any = useSafeSdk(signer, null);

  const deploySafe = async (owners, threshold) => {
    if (!safeFactory) {
      return null;
    }

    const safeAccountConfig: SafeAccountConfig = { owners, threshold };
    try {
      const safe = await safeFactory.deploySafe({ safeAccountConfig });
      const newSafeAddress = ethers.utils.getAddress(safe.getAddress());
      console.log('Created new safe: ', newSafeAddress);
      push(`/`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <div className="p-8 border-b md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Deploy a new safe
            </h3>
            <p className="mt-2 text-sm text-gray-500">You can add owners</p>
          </div>
          <div className="p-8 mt-5 border-b md:mt-0 md:col-span-2 grid grid-1 gap-4">
            {inputList.map((address, i) => {
              return (
                <div key={i}>
                  <div className="flex items-end">
                    <div className="w-[400px]">
                      <Input
                        label={`Owner ${i}`}
                        value={address}
                        onChange={e => handleInputChange(e, i)}
                      />
                    </div>
                    {inputList.length !== 1 && (
                      <div className="cursor-pointer ml-4 pb-2">
                        <SecondaryButton onClick={() => handleRemove(i)}>
                          Remove
                        </SecondaryButton>
                      </div>
                    )}
                  </div>

                  {inputList.length - 1 === i && (
                    <SecondaryButton onClick={handleAddClick}>
                      Add another owner
                    </SecondaryButton>
                  )}
                </div>
              );
            })}

            <div className="w-[400px] mt-8 mb-8">
              <Input
                value={initThreshold}
                onChange={e => setInitThreshold(e.target.value)}
                label="Any transaction requires the confirmation of:"
                suffix={`out of ${inputList.length} owner`}
              />
            </div>
            <div>
              <PrimaryButton
                onClick={() => deploySafe(inputList, initThreshold)}
                type={'primary'}
              >
                DEPLOY SAFE
              </PrimaryButton>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}
