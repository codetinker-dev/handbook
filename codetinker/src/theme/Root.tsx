import React, { useRef, useState, LegacyRef, RefObject } from "react";
import { signInWithGoogle, logout, auth, basicSignIn } from "./firebase";
import "../css/login.css";
import Loading from "./Loading";
import logo from "../../static/img/logo.png";

// Default implementation, that you can customize
export default function Root({ children }) {
  const [userAuth, setUserAuth] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const emailRef: LegacyRef<HTMLInputElement> = useRef(null);
  const passwordRef: RefObject<HTMLInputElement> = useRef(null);

  auth.onAuthStateChanged(async function (user) {
    if (user !== null) {
      setUserAuth(user);
    }

    setAuthLoading(false);
  });

  const isAllow = () => {
    return userAuth?.email;
  };

  if (authLoading) {
    return (
      <>
        <Loading />
        <div style={{ display: "none" }}>{children}</div>
      </>
    );
  }

  const handleLogin = (data) => {
    console.log({
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    });
    basicSignIn(emailRef.current?.value, passwordRef.current?.value);
  };

  return (
    <React.Fragment>
      {isAllow() ? (
        <>{children}</>
      ) : (
        <div className="login">
          <div className="login__container">
            <div className="logo">
              <img src={logo} alt="Logo" className="logo-image"/>
            </div>
            <div className="form">
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  ref={emailRef}
                  className="input-style"
                />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  className="input-style"
                />
              </div>
              <button
                className="login__btn login__submit"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            {/* <button className="login__btn login__google" onClick={handleLogin}>
              Login with Google
            </button> */}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
