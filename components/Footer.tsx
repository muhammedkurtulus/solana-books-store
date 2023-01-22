import { Button } from "primereact/button";
import { FC } from "react";

const Footer: FC = () => {
  const click = () => {
    window.open("https://github.com/muhammedkurtulus");
  };
  return (
    <div className="flex align-items-center justify-content-center mt-3 pt-3">
      <Button
        label=" muhammedkurtulus"
        className="p-button-secondary p-button-text"
        icon="pi pi-github"
        onClick={click}
      />
    </div>
  );
};

export default Footer;
