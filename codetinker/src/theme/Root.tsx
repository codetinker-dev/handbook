import React, {FormEvent, ReactNode, useEffect, useRef, useState} from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import "../css/login.css";
import Loading from "./Loading";
import {ChaseUser, getCurrentUser, signIn} from "./auth";

type RootProps = {
  children: ReactNode;
};

export default function Root({children}: RootProps) {
  const {siteConfig} = useDocusaurusContext();
  const apiUrl = siteConfig.customFields?.backendApiUrl as string;
  const logoUrl = useBaseUrl("/img/logo-full.png");
  const [userAuth, setUserAuth] = useState<ChaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCurrentUser(apiUrl)
      .then(setUserAuth)
      .catch(() => setUserAuth(null))
      .finally(() => setAuthLoading(false));
  }, [apiUrl]);

  if (authLoading) {
    return (
      <>
        <Loading />
        <div style={{display: "none"}}>{children}</div>
      </>
    );
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const user = await signIn(
        apiUrl,
        emailRef.current?.value.trim() ?? "",
        passwordRef.current?.value ?? "",
      );
      setUserAuth(user);
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <React.Fragment>
      {userAuth ? (
        <>{children}</>
      ) : (
        <div className="login">
          <div className="login__container">
            <div className="logo">
              <img src={logoUrl} alt="Logo" className="logo-image" />
            </div>
            <form className="form" onSubmit={handleLogin}>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  ref={emailRef}
                  className="input-style"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="form-field">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  className="input-style"
                  autoComplete="current-password"
                  required
                />
              </div>
              {loginError ? (
                <div className="login__error" role="alert">
                  {loginError}
                </div>
              ) : null}
              <button
                type="submit"
                className="login__btn login__submit"
                disabled={loginLoading}
              >
                {loginLoading ? "Logging in…" : "Login"}
              </button>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
