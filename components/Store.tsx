import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Image } from "primereact/image";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { FC, useEffect, useState } from "react";
import { ProductService } from "../services/ProductService";

const Store: FC = () => {
  const [tx, setTx] = useState("");
  const [transactionState, setTransactionState] = useState(false);
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const storePublicKey = "27PF83wkyryFHV883FPrPHjBt9sD3xhRDJrhSVtPU8eB";
  const [products, setProducts] = useState([]);
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
    const recipientPubKey = new web3.PublicKey(storePublicKey);

    try {
      const sendSolInstruction = web3.SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
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

      setTx(latestBlockHash.blockhash);
      setTransactionState(false);
      window.alert("Successfull");
    } catch (error) {
      window.alert("Error: Request rejected or insufficient funds");
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
    <div className="carousel-demo">
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

      <div className="card">
        <div className="card-container">
          <div className="flex">
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
        </div>
      </div>
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
  );
};
export default Store;
