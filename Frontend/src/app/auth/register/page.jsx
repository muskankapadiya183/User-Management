/* eslint-disable @next/next/no-img-element */
"use client";
import "../../../styles/layout/login.css";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "reactstrap";
import { TailSpin } from 'react-loader-spinner';
import axios from "axios";
import notify from "@/app/(DashboardLayout)/components/Notification/notify";
import NotificationContainer from "@/app/(DashboardLayout)/components/Notification/NotificationContainer";
import { register_me } from "../../../../Services/auth";

const Register = () => {
  const { register, watch, reset, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false)
  const formSubmit = async (data) => {
    console.log('data :>> ', data);
    setLoading(true);
    const res = await register_me(data);
    if (res.status_code === 200) {
      setLoading(false);
      notify(`User Register Successfully`, "success");
      window.location.href = "/admin/home";
    } else {
      setLoading(false);
      notify(`${res?.error?.email[0]} !`, "error");
      reset({
        email: ''
      });
    }
  }

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
  return (
    <>
      <NotificationContainer />
      <div className="loginBox">
        <div className="position-absolute start-0 bottom-0">
          <img
            alt="left"
            loading="lazy"
            width="376"
            height="317"
            decoding="async"
            data-nimg="1"
            src="/images/icons/login-bgleft.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="position-absolute end-0 top">
          <img
            alt="right"
            loading="lazy"
            width="235"
            height="255"
            decoding="async"
            data-nimg="1"
            src="/images/icons/login-bg-right.svg"
            style={{ color: "transparent" }}
          />
        </div>
        <div className="h-100 container-fluid">
          <div className="justify-content-center align-items-center h-100 row">
            <div className="loginContainer col-lg-12">
              <div className="p-4 d-flex justify-content-center gap-2">
                <span className="d-flex align-items-center gap-2">
                <h3>User Management</h3>
                </span>
              </div>
              <div className="card" style={{width: "500px"}}>
                <div className="p-4 m-1 card-body">
                  <div className="d-flex justify-content-center"></div>
                  <h4 className="mb-4 fw-semibold">Sign Up</h4>
                  <form action="#" onSubmit={handleSubmit(formSubmit)}>
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
                        {...register("cell_number", {
                          required: "Cell number is required",
                        })}
                      />
                      {errors.cell_number?.message && (
                        <small className="text-danger">
                          {errors.cell_number.message}
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
                        className={`form-control ${errors.email ? "is-invalid" : ""
                          }`}
                        type="text"
                        name="email"
                        {...register("email", {
                          required: "Email is required",
                          validate: {
                            maxLength: (v) =>
                              v.length <= 50 || "The email should have at most 50 characters",
                            matchPattern: (v) =>
                              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                              "Email address must be a valid address",
                          },
                        })}
                      />
                      {errors.email?.message && (<small className="text-danger">{errors.email.message}</small>)}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="role_id" className="form-label">
                        User Role
                      </label>
                      <select
                        name="role_id"
                        id="role_id"
                        className={`form-control ${
                          errors.role ? "is-invalid" : ""
                        }`}
                        {...register("role_id", {
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
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        type="password"
                        name="password"
                        {...register("password", {
                          required: "Password is required",
                        })}
                      />
                      {errors.password?.message && (
                        <small className="text-danger">
                          {errors.password.message}
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      {loading ? (
                        <Button className="w-100 btn btn-primary" type="button" color="primary" block>
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
                        <Button className="w-100 btn btn-primary" type="submit" color="primary" block>
                          Submit
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
