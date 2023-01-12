import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import dynamic from "next/dynamic";
import { FC, ReactNode, useMemo } from "react";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const url = useMemo(() => clusterApiUrl("devnet"), []);
  const phantom = new PhantomWalletAdapter();

  return (
    <ConnectionProvider endpoint={url}>
      <WalletProvider wallets={[phantom]}>
        <WalletModalProviderDynamic>{children}</WalletModalProviderDynamic>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
