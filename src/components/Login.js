import React, { useState,useRef } from "react";
import { useNavigate } from "react-router-dom";

export const Login = (props) => {
    const ref = useRef()
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [fcredentials, setFcredentials] = useState({ femail: "", fconfirmation:"",fpassword: "" });
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });
    const json = await response.json();
    if (json.success===true) {
      // redirect
      localStorage.setItem("token", json.authToken);
      localStorage.setItem("name", json.name);
      props.showAlert("Logged in SuccessFully", "success");
      navigate("/");
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };
  const handleFsubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/forgotpassword/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: fcredentials.femail,
        confirmation: fcredentials.fconfirmation,
        password: fcredentials.fpassword
      }),
    });
    const json = await response.json();
    if (json.success===true) {
      // redirect
      props.showAlert("Password Updated SuccessFully", "success");
      ref.current.click();
    } else {
      props.showAlert("Invalid credentials", "danger");
    }
  };
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]:e.target.value });
  };
  const onFchange = (e) => {
    setFcredentials({ ...fcredentials, [e.target.name]:e.target.value });
  };
  return (
    <div className="container">
      <h2>Login to continue to iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            aria-describedby="emailHelp"
            onChange={onChange}
            value={credentials.email}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            onChange={onChange}
            value={credentials.password}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <button
        type="button"
        className="btn btn-primary mx-2"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Forgot Password
      </button>
      </form>
      

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Forgot Password
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={ref}
              ></button>
            </div>
            <div className="modal-body">
            <form onSubmit={handleFsubmit}>
        <div className="mb-3">
          <label htmlFor="femail" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="femail"
            name="femail"
            aria-describedby="emailHelp"
            onChange={onFchange}
            value={fcredentials.femail}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fconfirmation" className="form-label">
          What is the thing you love most in the world?
          </label>
          <input
            type="text"
            className="form-control"
            id="fconfirmation"
            name="fconfirmation"
            onChange={onFchange}
            value={fcredentials.fconfirmation}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fpassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            className="form-control"
            id="fpassword"
            name="fpassword"
            onChange={onFchange}
            value={fcredentials.fpassword}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update
        </button>
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
