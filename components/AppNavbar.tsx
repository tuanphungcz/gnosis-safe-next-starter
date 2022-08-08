import Dropdown from 'components/base/Dropdown';
import Link from 'next/link';
import { useAccount, useConnect } from 'wagmi';
import { PrimaryButton } from './base/Button';
import Container from './base/Container';

export default function AppNavbar() {
  const { isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect();

  return (
    <div className="bg-white">
      <Container>
        <div className="flex items-center justify-between w-full py-4">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="text-xl font-bold ">Gnosis safe</div>
              <div className="ml-2 block rounded-full bg-gray-700 px-2 py-0.5 text-xs font-semibold text-white ">
                next starter
              </div>
            </div>
          </Link>
          <div className="flex justify-center space-x-6 md:order-2">
            {isConnected ? (
              <Dropdown />
            ) : (
              <PrimaryButton>
                <div>
                  {connectors.map(connector => (
                    <button
                      disabled={!connector.ready}
                      key={connector.id}
                      onClick={() => connect({ connector })}
                    >
                      {connector.name} auth
                      {!connector.ready && ' (unsupported)'}
                      {isLoading &&
                        connector.id === pendingConnector?.id &&
                        ' (connecting)'}
                    </button>
                  ))}

                  {error && <div>{error.message}</div>}
                </div>
              </PrimaryButton>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
