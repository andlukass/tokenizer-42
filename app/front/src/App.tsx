import { useEffect, useState } from 'react';
import Header from './components/Header';
import TicTacToe from './components/TicTacToe';
import { connectWallet, disconnectWallet, isEvmNetwork, onAccountsChanged, onChainChanged, tryAutoConnect } from './lib/wallet';

function App() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tryAutoConnect().then(async (address) => {
      if (address) {
        setWalletAddress(address);
        setWrongNetwork(!(await isEvmNetwork()));
      }
    });

    const unsubAccounts = onAccountsChanged((address) => {
      setWalletAddress(address);
      if (!address) setWrongNetwork(false);
    });

    const unsubChain = onChainChanged((isEvm) => {
      setWrongNetwork(!isEvm);
    });

    return () => {
      unsubAccounts();
      unsubChain();
    };
  }, []);

  const handleConnect = async () => {
    setError(null);
    try {
      const address = await connectWallet();
      setWalletAddress(address);
      setWrongNetwork(false);
    } catch (err: any) {
      setError(err.message ?? 'Connection failed');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setWrongNetwork(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header
        walletAddress={walletAddress}
        wrongNetwork={wrongNetwork}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
      />

      {error && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">{error}</div>
        </div>
      )}

      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <TicTacToe walletAddress={walletAddress} />
      </main>
    </div>
  );
}

export default App;
