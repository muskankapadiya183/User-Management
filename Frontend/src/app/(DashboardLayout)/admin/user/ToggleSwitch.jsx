import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import "../../../../styles/layout/toggle.css";

const ToggleSwitch = ({ id, is_active, handleSuccess }) => {
  const [isVerified, setIisVerified] = useState("");
  useEffect(() => {
    setIisVerified(is_active);
  }, [is_active]);

  const changeVerify = async (e) => {
    let isChecked = e.target.checked;
    Swal.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const token = JSON.parse(localStorage.getItem("Token"));
        const userToken = Object.keys(token).length > 0 && token?.access;
        let config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        };
        const obj = {
          is_active: isChecked,
        };

        await axios
          .patch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/update-user-flags/${id}/`,
            obj,
            config
          )
          .then(
            (res) => {
              // setLoading(false);
              Swal.fire("Status Changed!", "", "success");
              setIisVerified(!isVerified);
              handleSuccess();
            },
            (error) => {
              Swal.fire("Something went wrong!", "", "error");
              setIisVerified(isVerified);
              // setLoading(false);
              // setError(error);
            }
          );
      }
    });
  };

  return (
    <div className="toggle-switch">
      <OverlayTrigger
        delay={{ hide: 450, show: 300 }}
        overlay={(props) => (
          <Tooltip {...props}>
            {!isVerified ? <>Activate</> : <>Deactivate</>} User
          </Tooltip>
        )}
        placement="bottom"
      >
        <input
          type="checkbox"
          className="ui-toggle"
          onChange={(e) => changeVerify(e)}
          checked={isVerified}
        />
      </OverlayTrigger>
    </div>
  );
};

export default ToggleSwitch;
