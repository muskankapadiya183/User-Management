import React, { useEffect, useRef, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  Navbar,
  Collapse,
  Nav,
  NavItem,
  NavbarBrand,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
  Button,
} from "reactstrap";
import LogoWhite from "public/images/icons/white_logo.png";
import user1 from "public/images/users/user1.jpg";
import { useRouter } from "next/navigation";
import axios from "axios";
import moment from "moment";
import styles from "./Header.module.css";
import notify from "../../components/Notification/notify";
import NotificationContainer from "../../components/Notification/NotificationContainer";

const navigationMenu = [
  {
    title: "Profile",
    href: "/admin/Prfile",
    icon: "bi bi-patch-check",
  },
];

const Header = ({ showMobmenu }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const Handletoggle = () => {
    setIsOpen(!isOpen);
  };



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User") ?? "{}");
    setUser(user);
    if (user?.cell_number === "") {
      window.location.href = "/";
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Token");
    window.location.href = "/";
  };

  // On Hover Dropdown open handleFunctions
  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <NotificationContainer />
      <Navbar color="primary" dark expand="md">
        <div className="d-flex align-items-center">
          <NavbarBrand href="/" className="d-lg-none">
            <Image
              alt="logo"
              loading="lazy"
              width={170}
              decoding="async"
              data-nimg={1}
              style={{ color: "transparent" }}
              src={LogoWhite}
            />
          </NavbarBrand>
          <Button color="primary" className="d-lg-none" onClick={showMobmenu}>
            <i className="bi bi-list text-light"></i>
          </Button>
        </div>
        <div className="hstack gap-2">
          <Button
            color="primary"
            size="sm"
            className="d-sm-block d-md-none"
            onClick={Handletoggle}
          >
            {isOpen ? (
              <i className="bi bi-x"></i>
            ) : (
              <i className="bi bi-three-dots-vertical"></i>
            )}
          </Button>
        </div>
        <Collapse navbar isOpen={isOpen}>
          <Nav className="me-auto" navbar></Nav>
          <ul className="d-flex flex-row align-items-center navbar-nav">
            <div className="mega-dropdown mx-1 hov-dd dropdown">
              <div className="bg-transparent">
                <div className="">
                </div>
              </div>
            </div>
            <div className="mega-dropdown mx-1 hov-dd dropdown">
              <div className="bg-transparent">
                <div className="">
                  {Object.keys(user).length > 0 && user?.name}{" "}
                </div>
                <small>{Object.keys(user).length > 0 && user?.email}</small>{" "}
                <small className="text-medium fw-semibold">
                  {Object.keys(user).length > 0 &&
                    user?.role_id === 'ADMIN' ?
                    "Admin" : "Normal"}
                </small>
              </div>
            </div>
          </ul>

          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle color="primary">
              <div style={{ lineHeight: "0px" }}>
                <Image
                  src={user1}
                  alt="profile"
                  className="rounded-circle"
                  width="30"
                  height="30"
                />
              </div>
            </DropdownToggle>

            <DropdownMenu>
              <DropdownItem>
                <div className="d-flex gap-4 p-3 pt-2 pb-2">
                  <Image
                    alt="user"
                    loading="lazy"
                    width={60}
                    height={60}
                    decoding="async"
                    data-nimg={1}
                    className="rounded-circle"
                    src={user1}
                    style={{ color: "transparent" }}
                  />

                  <span className="mt-2">
                    <h6 className="mb-0 text-light">
                      {Object.keys(user).length > 0 && user?.name}
                    </h6>
                    <small className="text-light fs-7">
                      {Object.keys(user).length > 0 && user?.email}
                    </small>
                  </span>
                </div>
              </DropdownItem>
              <DropdownItem divider />
              {navigationMenu.map((item, index) => (
                <DropdownItem
                  key={index}
                  tabIndex={0}
                  // role="menuitem"
                  className="px-3 py-3 d-flex"
                  href={item.href}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="#FFFFFF"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx={12} cy={7} r={4} />
                  </svg>
                  <span className="ms-3 text-light">{item.title}</span>
                </DropdownItem>
              ))}
              <DropdownItem divider />
              <DropdownItem
                tabIndex={0}
                // role="menuitem"
                className="px-3 py-3 d-flex"
                onClick={handleLogout}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="#FFFFFF"
                  stroke="currentColor"
                  strokeWidth={0}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1"
                >
                  <g clipPath="url(#clip0_1199_138)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.11256 0.75C2.1001 0.75 2.08765 0.75031 2.07522 0.75093C1.49768 0.779719 0.955076 1.03617 0.566199 1.46413C0.181579 1.88741 -0.021668 2.44436 -0.000443399 3.01539V20.9848C-0.0213439 21.5557 0.181993 22.1124 0.566503 22.5356C0.955205 22.9634 1.49744 23.2199 2.0747 23.249C2.08731 23.2497 2.09993 23.25 2.11256 23.25H14.3856C14.398 23.25 14.4105 23.2497 14.4229 23.2491C15.0004 23.2203 15.543 22.9639 15.9321 22.5361C16.3169 22.1129 16.5204 21.556 16.4996 20.9849V16.5C16.4996 16.0858 16.1638 15.75 15.7496 15.75C15.3353 15.75 14.9996 16.0858 14.9996 16.5V21C14.9996 21.0045 14.9996 21.0089 14.9997 21.0134C14.9997 21.0164 14.9998 21.0194 14.9999 21.0225L15.0003 21.0338C15.0085 21.2153 14.9445 21.3926 14.8223 21.527C14.7035 21.6576 14.5392 21.7373 14.3635 21.75H2.13496C1.95943 21.7372 1.79527 21.6574 1.67665 21.5268C1.55454 21.3925 1.4906 21.2152 1.49879 21.0338C1.4993 21.0226 1.49956 21.0113 1.49956 21V3C1.49956 2.98854 1.49929 2.97709 1.49877 2.96564C1.49046 2.78437 1.55431 2.60719 1.67634 2.47288C1.79495 2.34235 1.95913 2.26267 2.13465 2.25H14.3635C14.5392 2.26268 14.7035 2.34241 14.8223 2.47302C14.9445 2.60741 15.0085 2.78473 15.0003 2.96619C14.9998 2.97745 14.9996 2.98873 14.9996 3V7.5C14.9996 7.91421 15.3353 8.25 15.7496 8.25C16.1638 8.25 16.4996 7.91421 16.4996 7.5V3.01514C16.5204 2.444 16.3169 1.88707 15.9321 1.46387C15.543 1.03605 15.0004 0.779717 14.4229 0.75093C14.4105 0.75031 14.398 0.75 14.3856 0.75H2.11256ZM18.9697 7.72367C19.2626 7.43077 19.7374 7.43077 20.0303 7.72367L23.7803 11.4737C23.8522 11.5456 23.9065 11.6285 23.9431 11.7169C23.9798 11.8053 24 11.9023 24 12.004C24 12.1959 23.9268 12.3879 23.7803 12.5343L20.0303 16.2843C19.7374 16.5772 19.2626 16.5772 18.9697 16.2843C18.6768 15.9914 18.6768 15.5166 18.9697 15.2237L21.4393 12.754H7.5C7.08579 12.754 6.75 12.4182 6.75 12.004C6.75 11.5898 7.08579 11.254 7.5 11.254H21.4393L18.9697 8.78433C18.6768 8.49143 18.6768 8.01656 18.9697 7.72367Z"
                      fill="#ffffff"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1199_138">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="ms-3 text-light">Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Collapse>
      </Navbar>
    </>
  );
};

export default Header;
