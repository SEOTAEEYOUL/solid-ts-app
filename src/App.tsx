import { type Component, createSignal, createEffect } from 'solid-js';
import { Router, Route, useNavigate } from '@solidjs/router'; 

import logo from './logo.svg';
import styles from './App.module.css';

import MenuBtn from './components/MenuBtn';
import Home from "./pages/Home";
// import Login from "./Login";
import BootstrapLogin from './pages/BootstrapLogin';
import LoginCallback from './pages/LoginCallback';
import DatePicker from './components/DatePicker';
import ErrorBoundary from './components/ErrorBoundary';

import { useOkta } from './components/OktaProvider.tsx';


import viteLogo from '/vite.svg'
import SolidjsLogo from './assets/Solid.js.png'
import TypeScriptLogo from './assets/typescript-logo.png'
import HMRLogo from './assets/webpack-logo.png'
import FlatpickrLogo from './assets/flatpickr-logo.png'
import OktaLogo from './assets/okta-logo.png'
import './App.css'



const App: Component = () => {
  const navigate = useNavigate();
  const { authState, oktaAuth } = useOkta();
  const [currentMenu, setCurrentMenu] = createSignal('Home');
  const [selectedDate, setSelectedDate] = createSignal<string | null>(null); // 날짜 상태 추가
  // const isLoggedIn = authState.isAuthenticated; // 일회성 값 캡처
  const isLoggedIn = () => authState.isAuthenticated; // 반응형 접근


  createEffect(() => {
    console.log("로그인 상태:", isLoggedIn() ? "로그인됨" : "로그아웃됨");
  });

  // ✅ 로그인/로그아웃 핸들러 추가
  const handleLogin = async () => {
    console.log("로그인 시도 시작");
    try {
      // await oktaAuth.signInWithRedirect({ originalUri: '/' });
      await oktaAuth.signInWithRedirect();
      console.log("로그인 리다이렉트 성공");
    } catch (e) {
      console.error('로그인 오류:', {
        name: e.name,
        message: e.message,
        errorCode: e.errorCode,
        stack: e.stack
      });
    }
  };

  const handleLogout = async () => {
    console.log("로그아웃 시도 시작");
    try {
      await oktaAuth.signOut({
        postLogoutRedirectUri: window.location.origin + "/login"
      });
      oktaAuth.tokenManager.clear();
      localStorage.removeItem('okta-token-storage');
      oktaAuth.authStateManager.updateAuthState();
      console.log("로그아웃 성공");
      navigate("/"); // 로그아웃 후 Home(최초 화면)으로 이동
    } catch (e) {
      console.error('로그아웃 오류:', e);
    }
  };


  return (
    <div class={styles.App}>
      {/* 현재 선택 메뉴 중앙 상단에 표시 */}
      <div
        style={{
          "text-align": "center",
          "font-weight": "bold",
          color: "#1976d2",
          "font-size": "1.5rem",
          margin: "24px 0 16px 0"
        }}
      >
        {currentMenu() === "Calendar"
          ? "Calendar"
          : currentMenu() === "Settings"
          ? "Settings"
          : isLoggedIn()
          ? "로그아웃"
          : currentMenu()}
      </div>

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://github.com/solidjs/solid" target="_blank">
          <img src={SolidjsLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://www.typescriptlang.org/docs/" target="_blank">
          <img src={TypeScriptLogo} className="logo" alt="TypeScript logo" />
        </a>    
        <a href="https://webpack.kr/guides/hot-module-replacement/" target="_blank">
          <img src={HMRLogo} className="logo" alt="HMR logo" />
        </a>    
        <a href="https://flatpickr.js.org/examples/" target="_blank">
          <img src={FlatpickrLogo} className="logo" alt="flatpickr logo" />
        </a>
        <a href="https://developer.okta.com/docs/guides/sign-into-spa-redirect/react/main/" target="_blank">
          <img src={OktaLogo} className="logo" alt="Okta logo" />
        </a>    
      </div>
    
      {/* <h1>Vite + Solid + TypeScript </h1> */}

      {/* <p className="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p> */}


      {/* 현재 메뉴 표시 */}
      {/* <h2>Current Menu: {currentMenu}</h2> */}

      {/* Menu Buttons */}
      {/* <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}> */}
      {/* <div class={styles["menu-btn-row"]}> */}
      <div>
        {/* 메뉴 버튼 컴포넌트 사용 */}
        {/* ✅ MenuBtn 컴포넌트에 onClick 핸들러 추가 */}
        <MenuBtn 
          menuName="Home" 
          imgURL="/public/home.png"
          selectimgURL="/public/home-selected.png"
          isActive={currentMenu() === "Home"}
          onClick={() => {
            setCurrentMenu("Home");
            if (window.location.pathname === "/") {
              window.location.reload(); // 이미 Home이면 강제 새로고침
            } else {
              navigate("/"); // 아니면 Home으로 이동
            }
          }}
        />

        <MenuBtn 
          menuName={isLoggedIn() ? "Okta 로그아웃" : "Okta 로그인"}
          imgURL={isLoggedIn() ? "/public/profile-selected.png" : "/public/profile.png"}
          selectimgURL={isLoggedIn() ? "/public/profile-selected.png" : "/public/profile.png"}
          isActive={isLoggedIn()} 
          onClick={() => {
            if (isLoggedIn()) {
              handleLogout(); // Okta 로그아웃
            } else {
              handleLogin();  // Okta 로그인
            }
          }}
        >
          {isLoggedIn() && <span>(현재 로그인됨)</span>}
        </MenuBtn>

        <MenuBtn 
          menuName="Settings" 
          imgURL="/public/settings.png" 
          selectimgURL="/public/settings-selected.png" 
          isActive={currentMenu() === "Settings"} 
          onClick={() => {
            setCurrentMenu("Settings");
            // if (window.location.pathname === "/") {
            //   window.location.reload(); // 이미 Home이면 강제 새로고침
            // } else {
            //   navigate("/"); // 아니면 Home으로 이동
            // }
          }}
        />
        <MenuBtn 
          menuName="Calendar" 
          imgURL="/public/calendar.png" 
          selectimgURL="/public/calendar-selected.png" 
          isActive={currentMenu() === "Calendar"} 
          onClick={() => setCurrentMenu(currentMenu() === "Calendar" ? "Home" : "Calendar")}
        >
          {currentMenu() === "Calendar" && (
            <>
              <ErrorBoundary>
                <DatePicker
                  onClose={() => setCurrentMenu("Home")}
                  onChange={(dateStr) => setSelectedDate(dateStr)}
                />
              </ErrorBoundary>
              {/* 선택된 날짜 표시 */}
              <div style={{ marginTop: "12px", color: "#fff" }}>
                {selectedDate() ? `선택된 날짜: ${selectedDate()}` : "날짜를 선택하세요."}
              </div>
            </>
          )}
        </MenuBtn>
      </div>

      {/* 라우터(페이지 전환 영역) */}
      <div>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/login" element={<BootstrapLogin />} />
          <Route path="/login/callback">
            <LoginCallback loadingElement={<div>인증 처리 중...</div>} />
          </Route>
          <Route path="*" element={<div>404 Not Found</div>} /> 
        </Router>
      </div>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <h1>환영합니다! 👋</h1>
        <p>이곳은 SolidJS + Okta 인증 데모의 홈 화면입니다.</p>
        <p>
          상단 또는 좌측 메뉴를 통해 로그인, 캘린더, 설정 등 다양한 기능을 이용해보세요.
        </p>
      </div>
    </div>

  );
};

export default App;
