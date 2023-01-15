import { FC, useEffect, useState } from "react";
import { Carousel } from "primereact/carousel";
import { Button } from "primereact/button";
import { ProductService } from "../services/ProductService";
import { Image } from "primereact/image";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Tag } from "primereact/tag";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";

const Store: FC = () => {
  const [balance, setBalance] = useState(0);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

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
    if (!connection || !publicKey) {
      return;
    }

    connection.getAccountInfo(publicKey).then((info) => {
      if (!info) setBalance(0);
      setBalance(info!.lamports);
    });
  }, [connection, publicKey]);

  useEffect(() => {
    productService.getProducts().then((data) => setProducts(data.slice(0, 9)));
  }, []);

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
              />
              <Button
                icon="pi pi-credit-card"
                className="p-button-help p-button-rounded mr-2"
                tooltip="Buy Now"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="carousel-demo">
      <div className="card">
        <div className="hidden-md">
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
