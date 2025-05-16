import React, { useState, useEffect } from "react";
import { Button, Nav, NavItem } from "reactstrap";
import Logo from "../../shared/logo/Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const navigation = [
  {
    title: "Dashboard",
    href: "/admin/home",
    icon: (
      <img src="/images/icons/dashboardIcon.svg" alt="Follow us on dashboard" />
    ),
    isShow: true,
    id: 0,
  },
  {
    title: "User",
    href: "/admin/user",
    icon: (
      <img src="/images/icons/inviteUserIcon.svg" alt="Follow us on User" />
    ),
    availableFor: ["User"],
    isShow: true,
    id: 1,
  },
  {
    title: "Profile",
    href: "/admin/profile",
    icon: (
      <img src="/images/icons/inviteUserIcon.svg" alt="Follow us on Profile" />
    ),
    availableFor: ["Profile"],
    isShow: true,
    id: 2,
  },
  
];

const Sidebar = ({ showMobilemenu }) => {
  const location = usePathname();
  const currentURL = location.slice(0, location.lastIndexOf('/admin/home'));
  const user = JSON.parse(localStorage.getItem("User") ?? "{}");


  const [moduleList, setModuleList] = useState([]);
  useEffect(() => {
    if (Object.keys(user).length > 0) {
      navigation.map((item, index) => {
        if (["/admin/user"].indexOf(item.href) >= 0 && user?.role_id === 'NORMAL'
        ) {
          item.isShow = false;
        } else if (
          [
            "/admin/profile",
          ].indexOf(item.href) >= 0 &&
          user?.role_id === 'ADMIN'
        ) {
          item.isShow = false;
        }
      });
    }
    setModuleList(navigation);
  }, [user]);


  return (
    <div className="p-3">
      <div className="d-flex align-items-center">
        <Logo />
        <span className="ms-auto d-lg-none">
          <Button close size="sm" onClick={showMobilemenu}></Button>
        </span>
      </div>
      <div className="pt-4 mt-2">
        <Nav vertical className="sidebarNav">
          {moduleList?.length > 0 &&
            moduleList.map((navi, index) => {
              if (navi.isShow) {
                return (
                  <NavItem key={index} className="sidenav-bg">
                    <Link
                      href={navi.href}
                      className={
                        location === navi.href
                          ? "text-primary nav-link py-3"
                          : "nav-link text-light py-3"
                      }
                    >
                      <span className={navi.icon}>{navi.icon}</span>
                      <span className="ms-3 d-inline-block">{navi.title}</span>
                    </Link>
                  </NavItem>
                )
              }
            })}
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
