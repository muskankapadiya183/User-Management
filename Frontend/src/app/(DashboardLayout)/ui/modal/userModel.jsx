"use client";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { TailSpin } from "react-loader-spinner";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notify from "../../components/Notification/notify";
import NotificationContainer from "../../components/Notification/NotificationContainer";
import "../../../../styles/layout/toggle.css";
import { Button } from "reactstrap";

const UsersModel = ({
  open,
  handleClose,
  userData,
  handleSuccess,
  roleData,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    getValues,
    unregister,
    control,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [moduleList, setModuleList] = useState([]);
  const [adminModuleList, setAdminModuleList] = useState([]);
  const [user, setUser] = useState("");
  const [userList, setUserList] = useState({});
  const selectedValue = watch("role");
  const getRole = [
    {
      id: "ADMIN",
      name: "Admin",
    },
    {
      id: "NORMAL",
      name: "Normal",
    },
  ];



  useEffect(() => {
    console.log('userData model :>> ', userData);
    if (userData) {
      setTimeout(() => {
        setValue("name", userData?.name);
        setValue("cell_number", userData?.cell_number);
        setValue("email", userData?.email);
        setValue("role_id",String(userData?.role_id));
        setValue("profile_pic",userData?.profile_pic);
      }, 100);
    }
  }, [userData]);

  //validation of password
  const password = watch("password", "");
  const password2 = watch("password2", "");
  const validatePasswordMatch = (value) => {
    return value === password || "Passwords do not match";
  };

  const formSubmit = async (data) => {
    const user = JSON.parse(localStorage.getItem("User"));
    const token = JSON.parse(localStorage.getItem("Token"));
    const userToken = Object.keys(token).length > 0 && token?.access;
    const inviteData = {
      ...data,
    };
    // return false;
    setLoading(true);
    if (userData && Object.keys(userData).length > 0) {
      const updateData = {
        id: userData.id,
        cell_number: inviteData.cell_number,
        name: inviteData.name,
        email: inviteData.email,
        role_id: inviteData.role_id,
        // profile_pic: inviteData.profile_pic,
        // password: inviteData.password,
        // confirm_password: inviteData.password2,
      };

      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user`,
          updateData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((res) => {
          if (res.data.status_code === 200) {
            setLoading(false);
            notify(`${res?.data?.msg}`, "success");
            handleSuccess();
            handleClose();
          } else {
            setLoading(false);
            notify(`${res?.data?.msg}`, "error");
          }
        })
        .catch((error) => {
          setLoading(false);
          notify(`${error?.response?.data?.detail}`, "error");
          localStorage.removeItem("User");
          localStorage.removeItem("Token");
          window.location.href = "/";
        });
    } else {
      const userObj = {
        cell_number: inviteData.cell_number,
        name: inviteData.name,
        email: inviteData.email,
        role_id: inviteData.role,
        // profile_pic: inviteData.profile_pic[0],
        password: inviteData.password,
        confirm_password: inviteData.password2,
      };

      // return false;
      axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user`, userObj, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            setLoading(false);
            notify(`${res?.data?.msg}`, "success");
            handleSuccess();
            handleClose();
          } else {
            setLoading(false);
            notify("User Not Added", "error");
          }
        })
        .catch((error) => {
          const resError = error.response.data.error;
          if (resError.email) {
            setLoading(false);
            notify(`${resError.email[0]}`, "error");
          } else if (resError.password) {
            setLoading(false);
            notify(`${resError.password[0]}`, "error");
          } else {
            setLoading(false);
            notify(`${error.response.data.msg}`, "error");
          }
        });
    }
  };

  const noSpaces = (value) => {
    return !/\s/.test(value) || "Spaces are not allowed";
  };
  return (
    <>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {userData && Object.keys(userData).length > 0 ? "Update" : "Create"}{" "}
            User
          </Modal.Title>
        </Modal.Header>
        <form action="#" onSubmit={handleSubmit(formSubmit)}>
          <Modal.Body>
            <div className="profile-tab row">
              <div className="col-md-12 col-12">
                <div className="mb-3">
                  <label htmlFor="cell_number" className="form-label">
                    Cell Number
                  </label>
                  <input
                    className={`form-control ${
                      errors.cell_number ? "is-invalid" : ""
                    }`}
                    type="text"
                    name="cell_number"
                    id="cell_number"
                    placeholder="Enter Cell number"
                    {...register("cell_number", {
                      required: true,
                    })}
                  />
                  {errors.cell_number?.message && (
                    <small className="text-danger">
                      {errors.cell_number.message}
                    </small>
                  )}
                  {errors?.cell_number?.type === "required" && (
                    <small className="text-danger">
                      CellNumber is required
                    </small>
                  )}
                </div>                  
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter Name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />
                  {errors.name?.message && (
                    <small className="text-danger">
                      {errors.name.message}
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter Email"
                    readOnly={Object.keys(userData).length > 0 ? true : false}
                    {...register("email", {
                      required: "Email is required",
                      validate: {
                        maxLength: (v) =>
                          v.length <= 50 ||
                          "The email should have at most 50 characters",
                        matchPattern: (v) =>
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                            v
                          ) || "Email address must be a valid address",
                      },
                    })}
                  />
                  {errors.email?.message && (
                    <small className="text-danger">
                      {errors.email.message}
                    </small>
                  )}
                </div>

                {userData && Object.keys(userData).length > 0 ? (
                  <>
                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">
                        User Role
                      </label>
                      <select
                        name="role"
                        id="role"
                        className={`form-control ${
                          errors.role ? "is-invalid" : ""
                        }`}
                        {...register("role", {
                          required: false,
                        })}
                        value={String(userData?.role_id)}
                        placeholder="Selected Role"
                        disabled
                      >
                        <option value="">Select Role </option>
                        {getRole.length > 0 &&
                          getRole.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </select>
                      {errors.role?.message && (
                        <small className="text-danger">
                          {errors.role.message}
                        </small>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">
                        User Role
                      </label>
                      <select
                        name="role"
                        id="role"
                        className={`form-control ${
                          errors.role ? "is-invalid" : ""
                        }`}
                        {...register("role", {
                          required: "role is required",
                        })}
                        placeholder="Selected Role"
                      >
                        <option value="">Select Role </option>
                        {getRole.length > 0 &&
                          getRole.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </select>
                      {errors.role?.message && (
                        <small className="text-danger">
                          {errors.role.message}
                        </small>
                      )}
                    </div>
                  </>
                )}
                
                {userData && Object.keys(userData).length === 0 && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="Password" className="form-label">
                        Password
                      </label>
                      <input
                        {...register("password", { required: true })}
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        type="password"
                        name="password"
                        placeholder="Enter New Password"
                        readOnly={
                          Object.keys(userData).length > 0 ? true : false
                        }
                      />
                      {errors.password && (
                        <span className="error text-danger">
                          {errors.password.message}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="examplePassword2" className="form-label">
                        Confirm Password
                      </label>
                      <input
                        {...register("password2", {
                          required: true,
                          validate: validatePasswordMatch,
                        })}
                        className={`form-control ${
                          errors.password2 ? "is-invalid" : ""
                        }`}
                        type="password"
                        name="password2"
                        placeholder="Enter Confirm Password"
                        readOnly={
                          Object.keys(userData).length > 0 ? true : false
                        }
                      />
                      {errors.password2 && (
                        <span className="error text-danger">
                          {errors.password2.message}
                        </span>
                      )}
                    </div>
                  </>
                )}

                
                {userData && Object.keys(userData).length > 0 ? (
                  <>
                    <img src={userData?.profile_pic} className="rounded" width={50} height={50}/>
                  </>
                ) : (
                  <>
                  <div className="mb-3">
                  <label htmlFor="profile_pic" className="form-label">
                    Upload Pic
                  </label>
                  <input
                    className={`form-control ${
                      errors.profile_pic ? "is-invalid" : ""
                    }`}
                    type="file"
                    name="profile_pic"
                    id="profile_pic"
                    placeholder="Enter Name"
                    {...register("profile_pic", {
                      required: "Profile is required",
                    })}
                  />
                  {errors.profile_pic?.message && (
                    <small className="text-danger">
                      {errors.profile_pic.message}
                    </small>
                  )}
                </div>
                  </>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="secondary"
              onClick={handleClose}
              className="text-light"
            >
              Close
            </Button>
            {loading ? (
              <Button
                type="button"
                color="primary"
                className="text-light bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
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
              </Button>
            ) : (
              <Button
                color="primary"
                type="submit"
                className="text-light bg-blue-600 da dark:bg-blue-600 dark:focus:ring-blue-800 dark:hover:bg-blue-700 float-end focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium hover:bg-blue-700 px-5 py-2.5 rounded-lg text-center text-sm"
              >
                {userData && Object.keys(userData).length > 0
                  ? "Update"
                  : "Invite"}
              </Button>
            )}
          </Modal.Footer>
        </form>
      </Modal>
      <NotificationContainer />
    </>
  );
};

export default UsersModel;
