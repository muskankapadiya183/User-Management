'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { TailSpin } from 'react-loader-spinner';
import notify from '../../components/Notification/notify';

const Profile = () => {
    
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState(true);
  const [error, setError] = useState(null);
    useEffect(() => {
        setTimeout(() => {
          fetchData();
        }, 1000);
      }, []);
    
      const fetchData = async (page, per_page) => {
        const user = JSON.parse(localStorage.getItem("User"));
        const token = JSON.parse(localStorage.getItem("Token"));
        const userToken = Object.keys(token).length > 0 && token?.access;
        await axios
          .get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/get-profile/${user.id}/`,
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
              setUserList(res.data.data);
            } else {
              notify(`${res.data.msg}`, "error");
            }
          })
          .catch((error) => {
            console.log("----",error);
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

  return (
    <>
        <div className="container-fluid mt-3">
        <div className="row ">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="table-responsive">
                    <h4 className='p-3'>Profile Data:</h4>
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
                    <>
                        <div className='p-3'>
                        <p><strong>Uid :</strong> {userList?.uid}</p>
                        <p><strong>Cell Number :</strong> {userList?.cell_number}</p>
                        <p><strong>Name :</strong> {userList?.name}</p>
                        <p><strong>Email :</strong> {userList?.email}</p>
                        <p><strong>Role :</strong> {userList?.role_id}</p>
                        <div className='d-flex'>
                        <p><strong>Profile Pic :</strong> </p><img className='ms-2' src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${userList?.profile_pic}`} width={75} height={75}/>
                        </div>
                        </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile