import { Image } from "primereact/image";
import { Menubar } from "primereact/menubar";
import { FC } from "react";

const Header: FC = () => {
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
    // <div className="hidden-sm">
    <div className="flex flex-row-reverse">
      <div className="flex align-items-center m-4">
        <Image src="solana.png" alt="Image" width="120" />
      </div>
    </div>
    // </div>
  );

  return (
    <div>
      <Menubar start={start} model={items} end={end} />
    </div>
  );
};

export default Header;
