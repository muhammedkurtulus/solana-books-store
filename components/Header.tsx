import React, { FC, useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

const Header: FC = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((info) => {
      if (!info) setBalance(0);
      setBalance(info!.lamports);
    });
  }, [connection, publicKey]);

  return (
    <div className="card">
      <div className="flex flex-row-reverse">
        <div className="flex align-items-center m-4">
          <WalletMultiButton />
        </div>
        <div className="flex align-items-center justify-content-center w-12rem h-4rem font-bold text-dark m-4">
          <p>
            {publicKey ? `Balance: ${balance / web3.LAMPORTS_PER_SOL} SOL` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
