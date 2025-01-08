import LogoComponent from "../Logo/logo";


const Footer = () => {
  return (
    <div>
      <div className="flex bg-primary h-96 items-center">
        <div className="w-1/2 font-primaryBold uppercase text-white">
          <LogoComponent />
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <ul className="list-none text-white ">
            <li className="text-[20px] font-primaryBold uppercase">contect</li>
            <li>Aongang/krabi</li>
            <li>KrabiEcoTechnology@gmail.com</li>
            <li>+66 2 123 4567</li>
          </ul>
        </div>
      </div>
      <div className="h-14 flex justify-center items-center bg-Footprimary text-white">
        © 2024 KrabiEcoTechnology
      </div>
    </div>
  );
};

export default Footer;
