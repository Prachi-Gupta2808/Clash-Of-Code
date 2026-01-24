import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log(credentialResponse);
        console.log(jwtDecode(credentialResponse.credential));
        navigate("/home");
      }}
      onError={() => console.log("Login Failure")}
      auto_select={true}
    />
  );
};

export default Login;
