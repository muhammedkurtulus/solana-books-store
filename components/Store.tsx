import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Image } from "primereact/image";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { FC, useEffect, useState } from "react";
import { ProductService } from "../services/ProductService";
import base58 from "bs58";
import { Chip } from "primereact/chip";

const Store: FC = () => {
  const decimals = 2;
  const amount = 1;
  const [tx, setTx] = useState("");
  const [transactionState, setTransactionState] = useState(false);
  const [balance, setBalance] = useState(0);
  const [products, setProducts] = useState([]);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const shopPrivateKey = process.env.STORE_PRIVATE_KEY as string;
  if (!shopPrivateKey) {
    console.log("Shop private key not available");
  }
  const shopKeypair = web3.Keypair.fromSecretKey(base58.decode(shopPrivateKey));

  const tokenAddress = new web3.PublicKey(
    "DU1u1FW5aKMZygDhAgiovJBD6HjGwwjFcxGeFCNeB7oC"
  );

  const productService = new ProductService();
  const responsiveOptions = [
    {
      breakpoint: "1024px",
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: "600px",
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: "480px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  useEffect(() => {
    productService.getProducts().then((data) => setProducts(data.slice(0, 9)));
  }, []);

  useEffect(() => {
    if (!connection || !publicKey) {
      return;
    }
    connection.getBalance(publicKey).then((info) => {
      if (!info) setBalance(0);
      setBalance(info);
    });
  }, [connection, publicKey, tx]);

  const clickBuy = async (productPrice: any) => {
    if (!connection || !publicKey) {
      window.alert("Please connect wallet");
      return;
    }

    const transaction = new web3.Transaction();

    try {
      const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: shopKeypair!.publicKey,
        lamports: web3.LAMPORTS_PER_SOL * productPrice,
      });

      transaction.add(sendSolInstruction);

      const sig = await sendTransaction(transaction, connection);
      setTransactionState(true);
      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: sig,
      });

      // Get the token account of the fromWallet address, and if it does not exist, create it
      const fromTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        shopKeypair!,
        tokenAddress,
        shopKeypair!.publicKey
      );

      // Get the token account of the toWallet address, and if it does not exist, create it
      const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
        connection,
        shopKeypair!,
        tokenAddress,
        publicKey
      );

      // Transfer the token
      const signature = await splToken.transfer(
        connection,
        shopKeypair!,
        fromTokenAccount.address,
        toTokenAccount.address,
        shopKeypair!.publicKey,
        amount * Math.pow(10, decimals)
      );
      setTx(latestBlockHash.blockhash);
      setTransactionState(false);
      console.log(
        `Token Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );

      window.alert(
        `Successfull - Check console log for transaction url and view Solbook token in your wallet`
      );
    } catch (error) {
      window.alert(
        "Error: Request rejected or Insufficient funds or not on Devnet network"
      );
      console.error(error);
    }
  };

  const productTemplate = (product: any) => {
    return (
      <div className="product-item">
        <div className="product-item-content">
          <div className="mb-3">
            <Image
              src={`data/${product.image}`}
              alt="Image"
              width="120"
              //onError={(e) => (e.target.src = "placeholder.png")}
            />
          </div>
          <div>
            <h4 className="mb-1">{product.name}</h4>
            <h6 className="mt-0 mb-3">{product.price} SOL</h6>
            <span
              className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}
            >
              {product.inventoryStatus}
            </span>
            <div className="mt-5">
              <Button
                icon="pi pi-star-fill"
                className="p-button-success p-button-rounded mr-2"
              />
              <Button
                icon="pi pi-cart-plus"
                className="p-button-info p-button-rounded mr-2"
                tooltip="Add to Cart"
                onClick={() => clickBuy(product.price)}
              />
              <Button
                icon="pi pi-credit-card"
                className="p-button-help p-button-rounded mr-2"
                tooltip="Buy Now"
                onClick={() => clickBuy(product.price)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="flex flex-column card-container">
        {transactionState ? (
          <>
            <h4 className="flex align-items-center mb-2 justify-content-center text-blue-900">
              Purchase in progress. This can take some time.
            </h4>
            <ProgressBar
              mode="indeterminate"
              style={{ height: "6px" }}
            ></ProgressBar>
          </>
        ) : (
          " "
        )}

        <div className="flex flex-row justify-content-center col-12">
          {publicKey ? (
            <div className="flex-1 flex align-items-center mt-2 justify-content-center">
              <Tag icon="pi pi-wallet">
                {balance / web3.LAMPORTS_PER_SOL} SOL
              </Tag>
            </div>
          ) : (
            ""
          )}

          <div className="flex-1 flex align-items-center mt-2 justify-content-center">
            <WalletMultiButton />
          </div>
        </div>
        <div className="flex-1 flex align-items-center mt-2 justify-content-center text-blue-900">
          <h1 className="text-center">Buy a book and earn </h1>
          <Image
            src="solbook.png"
            alt="Image"
            width="50"
            className="ml-2"
          />{" "}
          <h3 className="text-yellow-900">SLBK</h3>
        </div>

        <div className="flex-1 flex align-items-center mt-2 justify-content-center text-blue-900">
          <h3 className="text-center">
             Take advantage of opportunities with Solbook token
          </h3>
        </div>

        <div className="carousel-demo">
          <Carousel
            value={products}
            numVisible={3}
            numScroll={1}
            responsiveOptions={responsiveOptions}
            className="mt-4"
            circular
            autoplayInterval={5000}
            itemTemplate={productTemplate}
          />
        </div>
      </div>
    </div>
  );
};
export default Store;
