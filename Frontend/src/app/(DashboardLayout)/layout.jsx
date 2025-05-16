"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { Container } from "reactstrap";
import Header from "./layouts/header/Header";
import Sidebar from "./layouts/sidebars/vertical/Sidebar";
import NotificationContainer from "../(DashboardLayout)/components/Notification/NotificationContainer";

const FullLayout = ({ children }) => {
  const [open, setOpen] = React.useState(false);

  const showMobilemenu = () => {
    setOpen(!open);
  };

  const router = useRouter();
  const currentPage = usePathname();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("User"));
    if (!user) {
      window.location.href = "/";
    }
  }, []);


  return (
    <>
      <NotificationContainer />
      <main>
        <div className="pageWrapper d-md-block d-lg-flex">
          {/******** Sidebar **********/}
          <aside
            className={`sidebarArea shadow bg-white ${!open ? "" : "showSidebar"
              }`}
          >
            <Sidebar
              showMobilemenu={() => showMobilemenu()}
            />
          </aside>
          {/********Content Area**********/}

          <div className="contentArea">
            {/* <Provider> */}
              {/********header**********/}
              <Header
                showMobmenu={() => showMobilemenu()}
              />

              {/********Middle Content**********/}
              <Container className="p-4 wrapperNew">
                <div>{children}</div>
              </Container>
          </div>
        </div>
      </main>
    </>
  );
};

export default FullLayout;
