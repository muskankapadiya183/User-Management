import LogoDark from "public/images/icons/white_logo.png";
import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image 
        src={LogoDark} 
        alt="logo"
        loading="lazy"
        width={170}
        decoding="async"
        data-nimg={1}
        style={{ color: "transparent" }} />
    </Link>
  );
};

export default Logo;
