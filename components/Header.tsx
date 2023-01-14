import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import { Menubar } from "primereact/menubar";
import { Tag } from "primereact/tag";
import { FC, useEffect, useState } from "react";

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

  const items = [
    {
      label: "Search",
      icon: "pi pi-search",
      command: () => {
        console.log("menu command");
      },
    },
    {
      label: "Account",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Profile",
          icon: "pi pi-user-edit",
          url: "/",
        },
        {
          label: "Favorites",
          icon: "pi pi-star",
        },
      ],
    },
    {
      label: "Cart",
      icon: "pi pi-shopping-cart",
      command: () => {
        console.log("menu command");
      },
    },
  ];

  const start = (
    <div className="flex flex-row">
      <div className="flex align-items-center m-4">
        <img
          alt="logo"
          src="placeholder.png"
          height="40"
          className="mr-2"
        ></img>
        <p className="font-bold">Books Store</p>
      </div>
    </div>
  );
  const end = (
    <div className="hidden-sm">
      <div className="flex flex-row-reverse">
        <div className="flex align-items-center m-4">
          <WalletMultiButton />
        </div>
        <div className="flex align-items-center m-4">
          {publicKey ? (
            <Tag icon="pi pi-wallet">{balance / web3.LAMPORTS_PER_SOL} SOL</Tag>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="card">
        <Menubar start={start} model={items} end={end} />
      </div>
    </div>
  );
};

export default Header;
