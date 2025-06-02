// src/pages/Login.tsx
import { type Component } from "solid-js";
import { useOkta } from "../components/OktaProvider";

const Login: Component = () => {
  const { oktaAuth, authState } = useOkta();

  const handleLogin = () => {
    oktaAuth.signInWithRedirect({ originalUri: "/" });
  };

  if (authState.isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h2>이미 로그인되어 있습니다.</h2>
        <p>홈으로 이동하거나 로그아웃할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>로그인</h1>
      <p>Okta 계정으로 로그인하려면 아래 버튼을 눌러주세요.</p>
      <button style={{
        padding: "0.75rem 2rem",
        fontSize: "1.1rem",
        borderRadius: "8px",
        background: "#007dc1",
        color: "#fff",
        border: "none",
        cursor: "pointer"
      }} onClick={handleLogin}>
        Okta 로그인
      </button>
    </div>
  );
};

export default Login;
