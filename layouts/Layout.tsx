import AppNavbar from 'components/AppNavbar';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

function Layout({ children }) {
  const { isConnected } = useAccount();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <div>
        <AppNavbar />
        <div className='mt-8 text-center'>Please log in with your metamask</div>
      </div>
    );
  }

  return (
    <div className='mb-16'>
      <AppNavbar />
      {children}
    </div>
  );
}

export default Layout;
