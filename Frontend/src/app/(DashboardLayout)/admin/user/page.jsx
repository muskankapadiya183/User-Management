"use client";
import React, { useState, useEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import Excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import Swal from "sweetalert2";
import FilterComponent from "@/app/(DashboardLayout)/components/Filter/page";
import { Button, Badge } from "reactstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip';
import ToggleSwitch from "./ToggleSwitch";
import NotificationContainer from "@/app/(DashboardLayout)/components/Notification/NotificationContainer";
import notify from "@/app/(DashboardLayout)/components/Notification/notify";
import UsersModel from "@/app/(DashboardLayout)/ui/modal/userModel";

// DataTable Custom Theme
createTheme(
  "solarized",
  {
    text: {
			primary: '#FFFFFF',
			secondary: 'rgba(255, 255, 255, 0.7)',
			disabled: 'rgba(0,0,0,.12)',
      marginTop: 0,
      marginBottom: "0.5rem",
      fontWeight: 400,
      lineHeight: 1.2,
      color: "inherit",
		},
		background: {
			default: 'transparent',
		},
		context: {
			background: '#E91E63',
			text: '#FFFFFF',
		},
		divider: {
			default: 'rgba(81, 81, 81, 1)',
		},  
		selected: {
			default: 'rgba(0, 0, 0, .7)',
			text: '#FFFFFF',
		},
		highlightOnHover: {
			default: 'rgba(0, 0, 0, .7)',
			text: '#FFFFFF',
		},
		striped: {
			default: 'rgba(0, 0, 0, .87)',
			text: '#FFFFFF',
		},
  },
  "dark"
);

const User = () => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [OpenUserModal, SetOpenUserModal] = useState(false);
  const [userList, setUserList] = useState([]);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      fetchData(1, perPage);
    }, 1000);
  }, [perPage]);

  const fetchData = async (page, per_page) => {
    const token = JSON.parse(localStorage.getItem("Token"));
    const userToken = Object.keys(token).length > 0 && token?.access;
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-all-user?page=${page}&per_page=${per_page}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        if (res) {
          setUserList(res.data.data.results);
          setTotalRows(res.data.data.count);
          setPage(res.data.data.num_pages);
        } else {
          notify(`${res.data.msg}`, "error");
        }
      })
      .catch((error) => {
        setLoading(true);
        setError(error);

        const tokenInvalidMsg = error?.response?.data?.detail;
        if (tokenInvalidMsg) {
          notify(`${tokenInvalidMsg}`, "error");
          localStorage.removeItem("User");
          localStorage.removeItem("Token");
          window.location.href = "/";
        }
      });
  };

  const handlePageChange = (page) => {
    fetchData(page, perPage);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
  };



  const handleUserModalOpen = (data) => {
    console.log('data :>> ', data);
    SetOpenUserModal(true);
    setUserData(data);
  };

  const handleUserModelClose = () => {
    SetOpenUserModal(false);
    setUserData({});
  };

  const handleAddUserModelClose = () => {
    SetOpenUserModal(true);
  };

  // TeamMember Delete Function
  const handleDeleteUser = (data) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = JSON.parse(localStorage.getItem("Token"));
        const userToken = Object.keys(token).length > 0 && token?.access;
        const id = data;
        axios
          .delete(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/delete-user/${id}/`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
          .then(
            (res) => {
              // setLoading(false);
              if (res.data.status_code === 200) {
                Swal.fire("Delete Success!", "", "success");
                fetchData(1, perPage);
              }
            },
            (error) => {
              Swal.fire("Something went wrong!", "", "error");
            }
          )
          .catch((error) => {
            // setLoading(false);
            notify("Something Went Wrong", "error");
          });
      }
    });
  };

  // DataTable Columns
  const columnsData = [
    {
      name: "Cell Number",
      selector: (row) => row.cell_number,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      cell: (row) => {
        const roleName = getRoleNameById(row.role_id);
        return <div>{roleName}</div>;
      },
    },
    {
      name: "Profile",
      cell: (row) => {
        return <div>
          <img src={row.profile_pic} width={50} height={50} className="rounded"/>
        </div>;
      },
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <OverlayTrigger
            delay={{ hide: 450, show: 300 }}
            overlay={(props) => (
              <Tooltip {...props}>
                Update User
              </Tooltip>
            )}
            placement="bottom"
          >
          <a
            onClick={() => handleUserModalOpen(row)}
            className="btn"
          >
            <i className="bi bi-pencil-fill text-light"></i>
          </a>
          </OverlayTrigger>
          <OverlayTrigger
            delay={{ hide: 450, show: 300 }}
            overlay={(props) => (
              <Tooltip {...props}>
                Delete User
              </Tooltip>
            )}
            placement="bottom"
          >
          <a
            onClick={() => handleDeleteUser(row.id)}
            className="btn"
          >
            <i className="bi bi-trash3 text-light"></i>
          </a>
          </OverlayTrigger>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const getRoleNameById = (roleId) => {
    // Replace this with your logic to map IDs to role names
    switch (roleId) {
      case 'NORMAL':
        return "Admin";
      case 'ADMIN':
        return "Normal";
      default:
        return "Guest";
    }
  };


  return (
    <>
      <NotificationContainer />
      <div className="container-fluid mt-4 mb-4">
        <div className="cl-2 d-flex">
          <div className="me-auto">
          </div>
          <div className="ms-auto">
            <Button
              color="primary"
              className="float-right text-light bg-blue-600 da hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              variant="primary"
              onClick={handleAddUserModelClose}
            >
              Add User
            </Button>
          </div>
          {OpenUserModal && (
            <UsersModel
              open={OpenUserModal}
              handleClose={handleUserModelClose}
              userData={userData}
              handleSuccess={() => {
                fetchData(1, perPage);
              }}
            />
          )}
        </div>
      </div>
      <div className="container-fluid mt-3">
        <div className="row ">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                  {loading ? (
                    <TailSpin
                      height="20"
                      width="20"
                      color="white"
                      ariaLabel="tail-spin-loading"
                      radius="1"
                      wrapperStyle={{}}
                      wrapperClass="justify-content-center"
                      visible={true}
                    />
                  ) : (
                    <DataTable
                      className="px-3 no-wrap align-middle table table-borderless"
                      columns={columnsData}
                      // data={filteredItems}
                      // data={[]}
                      data={userList}
                      sortServer={true}
                      theme="solarized"
                      pagination
                      paginationServer
                      paginationTotalRows={totalRows}
                      onChangePage={handlePageChange}
                      onChangeRowsPerPage={handlePerRowsChange}
                      paginationPerPage={10}
                      paginationResetDefaultPage={resetPaginationToggle}
                      paginationComponentOptions={{
                        noRowsPerPage: true,
                      }}
                      persistTableHead
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default User;
