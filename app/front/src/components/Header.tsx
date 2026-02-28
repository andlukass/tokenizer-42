interface HeaderProps {
  walletAddress: string | null;
  wrongNetwork: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function Header({ walletAddress, wrongNetwork, onConnect, onDisconnect }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tokenizer 42</h1>

        <div className="flex items-center gap-3">
          {wrongNetwork && (
            <span className="bg-yellow-500 text-black text-xs font-semibold px-3 py-1 rounded-full">
              Wrong Network
            </span>
          )}

          {walletAddress ? (
            <>
              <div className="bg-slate-700 px-4 py-2 rounded-lg font-mono text-sm">
                {shortenAddress(walletAddress)}
              </div>
              <button
                onClick={onDisconnect}
                className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={onConnect}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
