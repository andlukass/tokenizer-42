const BASE_CHAIN_ID = '0x2105'; // 8453 decimal

const BASE_CHAIN_PARAMS = {
  chainId: BASE_CHAIN_ID,
  chainName: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
};

function getProvider(): any {
  if (typeof window === 'undefined') return undefined;
  return (window as any).ethereum;
}

async function switchToBase(provider: any): Promise<void> {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID }],
    });
  } catch (err: any) {
    // 4902 = chain not added to wallet yet
    if (err.code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [BASE_CHAIN_PARAMS],
      });
    } else {
      throw err;
    }
  }
}

export async function connectWallet(): Promise<string> {
  const provider = getProvider();
  if (!provider) {
    window.open('https://metamask.io/', '_blank');
    throw new Error('No Ethereum wallet found. Please install MetaMask.');
  }

  const accounts: string[] = await provider.request({ method: 'eth_requestAccounts' });
  await switchToBase(provider);

  return accounts[0];
}

export async function tryAutoConnect(): Promise<string | null> {
  const provider = getProvider();
  if (!provider) return null;
  try {
    const accounts: string[] = await provider.request({ method: 'eth_accounts' });
    if (accounts.length === 0) return null;
    // Don't switch chain here — switching fires chainChanged which would cause a loop
    return accounts[0];
  } catch {
    return null;
  }
}

export async function isOnBase(): Promise<boolean> {
  const provider = getProvider();
  if (!provider) return false;
  const chainId: string = await provider.request({ method: 'eth_chainId' });
  return chainId === BASE_CHAIN_ID;
}

export async function isEvmNetwork(): Promise<boolean> {
  const provider = getProvider();
  if (!provider) return false;

  try {
    const chainId: unknown = await provider.request({ method: 'eth_chainId' });
    return typeof chainId === 'string' && chainId.startsWith('0x');
  } catch {
    return false;
  }
}

// EIP-1193 has no disconnect — callers just clear local state
export function disconnectWallet(): void {}

export function onAccountsChanged(cb: (address: string | null) => void): () => void {
  const provider = getProvider();
  if (!provider) return () => {};

  const handler = (accounts: string[]) => cb(accounts[0] ?? null);
  provider.on('accountsChanged', handler);
  return () => provider.removeListener('accountsChanged', handler);
}

export function onChainChanged(cb: (isEvm: boolean) => void): () => void {
  const provider = getProvider();
  if (!provider) return () => {};

  const handler = (chainId: string) => cb(typeof chainId === 'string' && chainId.startsWith('0x'));
  provider.on('chainChanged', handler);
  return () => provider.removeListener('chainChanged', handler);
}
