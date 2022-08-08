import Safe, { SafeFactory } from '@gnosis.pm/safe-core-sdk';
import { useState, useEffect } from 'react';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import { ethers } from 'ethers';

const txServiceUrl = 'https://safe-transaction.goerli.gnosis.io';

const useSafeSdk = (userSigner, safeAddress) => {
  const [safeSdk, setSafeSdk]: any = useState();
  const [safeFactory, setSafeFactory]: any = useState();
  const [safeService, setSafeClient]: any = useState();

  useEffect(() => {
    let isCurrent = true;

    const updateSafeSdk = async () => {
      if (!userSigner) return;
      try {
        const ethAdapter = new EthersAdapter({ ethers, signer: userSigner });
        const safeService = new SafeServiceClient({ txServiceUrl, ethAdapter });

        const factory = await SafeFactory.create({ ethAdapter });
        setSafeClient(safeService);
        setSafeFactory(factory);
        if (!safeAddress) {
          return null;
        }
        /*
        // If the Safe contracts are not deployed in the current network, you can deploy them and pass the addresses to the SDK:
        const id = await ethAdapter.getChainId()
        const contractNetworks = {
          [id]: {
            multiSendAddress: <MULTI_SEND_ADDRESS>,
            safeMasterCopyAddress: <MASTER_COPY_ADDRESS>,
            safeProxyFactoryAddress: <PROXY_FACTORY_ADDRESS>
          }
        }
        */
        const safeSdk = await Safe.create({
          ethAdapter,
          safeAddress
        });
        if (isCurrent) {
          setSafeSdk(safeSdk);
        }
      } catch (error) {
        console.error(error);
      }
    };

    updateSafeSdk();

    return () => {
      isCurrent = false;
    };
  }, [userSigner, safeAddress]);

  return { safeSdk, safeFactory, safeService };
};

export default useSafeSdk;
