"use client";
import "../../../styles/layout/login.css";
import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button   } from 'reactstrap';
import { TailSpin } from "react-loader-spinner";
import NotificationContainer from "@/app/(DashboardLayout)/components/Notification/NotificationContainer";
import notify from "@/app/(DashboardLayout)/components/Notification/notify";
import { login_me } from "../../../../Services/auth";

const Login = () => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const formSubmit = async (data) => {
    setLoading(true);
    const res = await login_me(data);
    if (res.status_code === 200) {
      setLoading(false);
      const token = {
        access: res.data.access,
      };
      localStorage.setItem("User", JSON.stringify(res.data.user));
      localStorage.setItem("Token", JSON.stringify(token));
      window.location.href = "/admin/home";
    } else {
      setLoading(false);
      if (res?.error?.cell_number) {
        notify(`${res?.error?.cell_number[0]}`, "error")
        reset({
          cell_number: "",
          password: "",
        });
      } else if (res?.error?.non_field_errors) {
        notify(`${res?.error?.non_field_errors[0]}`, "error")
        reset({
          cell_number: "",
          password: "",
        });
      } else {
        notify(`${res.msg}`, "error")
        reset({
          cell_number: "",
          password: "",
        });
      }
    }
  };

  return (
    <>
      <NotificationContainer/>
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
              <div className="card">
                <div className="p-4 m-1 card-body">
                  <div className="d-flex justify-content-center"></div>
                  <h4 className="mb-4 fw-semibold">Sign In</h4>
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
                      {errors.password && (
                        <small className="text-danger">
                          {errors.password.message}
                        </small>
                      )}
                    </div>
                    <div className="mb-3">
                      {loading ? (
                        <Button className="w-100 btn btn-primary" color="primary" block>
                          <TailSpin
                            height="20"
                            width="20"
                            color="white"
                            ariaLabel="tail-spin-loading"
                            radius="1"
                            wrapperStyle={{}}
                            visible={true}
                            wrapperClass="justify-content-center"
                          />
                        </Button>
                      ) : (
                          <Button className="w-100 btn btn-primary" color="primary" block>
                          Sign in
                         </Button>
                      )}
                    </div>
                    
                    <div className="justify-content-center d-flex mb-3">
                    <small>Create a new account </small>
                      <a
                        className="ms-2 text-decoration-none"
                        href="/auth/register"
                      >
                        <small> Sign Up</small>
                      </a>
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

export default Login;