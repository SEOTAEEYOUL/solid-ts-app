import { createContext, useContext, createEffect, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { OktaAuth, toRelativeUrl, type OAuthResponseType } from "@okta/okta-auth-js";
import { useNavigate } from "@solidjs/router";

type AuthState = {
  isAuthenticated: boolean;
  user: any;
};

const OktaContext = createContext<{
  oktaAuth: OktaAuth;
  authState: AuthState;
}>();

export function useOkta() {
  const context = useContext(OktaContext);
  if (!context) throw new Error('OktaProvider 없음');
  return context;
}

// export default function OktaProvider(props: { children: JSX.Element }) {
export default function OktaProvider(props: { children: any }) {
  const navigate = useNavigate();
  const [authState, setAuthState] = createStore<AuthState>({
    isAuthenticated: false,
    user: null
  });

  // 환경 변수 체크
  if (!import.meta.env.VITE_OKTA_ORG_URL) {
    throw new Error("환경 변수 누락");
  }

  // Okta 설정 업데이트
  const oktaOptions = {
    issuer: `${import.meta.env.VITE_OKTA_ORG_URL}/oauth2/default`,
    clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
    redirectUri: `${window.location.origin}/login/callback`,
    pkce: true,
    responseType: ["code" as OAuthResponseType],
    scopes: ["openid", "profile", "email"],
    cookies: {
      secure: true, // 프로덕션 환경에서는 true
      sameSite: 'Lax'
    },
    tokenManager: {
      storage: 'localStorage'
    }
  };

  console.log("Okta 설정:", {
    issuer: oktaOptions.issuer,
    clientId: oktaOptions.clientId,
    redirectUri: oktaOptions.redirectUri,
    origin: window.location.origin,
    hostname: window.location.hostname
  });

  // OktaAuth 인스턴스 생성
  const oktaAuth = new OktaAuth(oktaOptions);

  const restoreOriginalUri = async (_: any, originalUri?: string) => {
    console.log("리다이렉트 요청:", {
      originalUri,
      currentPath: window.location.pathname,
      baseUrl: window.location.origin
    });
    navigate(toRelativeUrl(originalUri || "/", window.location.origin));
  };

  // 인증 상태 관리
  createEffect(() => {
    console.log("[Okta 인스턴스 초기화]");
    
    // 초기 인증 상태 확인
    oktaAuth.isAuthenticated().then(isAuthenticated => {
      console.log("[초기 인증 상태]", isAuthenticated);
      setAuthState({
        isAuthenticated,
        user: null
      });
    });

    const subscription = oktaAuth.authStateManager.subscribe((newState) => {
      console.groupCollapsed("[상태 변경 상세]");
      console.log("isAuthenticated:", newState.isAuthenticated);
      console.log("accessToken 만료 시간:", newState.accessToken?.expiresAt);
      console.log("사용자 정보:", newState.idToken?.claims);
      console.groupEnd();
      
      setAuthState({
        isAuthenticated: newState.isAuthenticated || false,
        user: newState.idToken?.claims,
      });
    });

    onCleanup(() => {
      console.log("[구독 해제]");
      subscription.unsubscribe();
    });
  });

  // restoreOriginalUri 설정
  createEffect(() => {
    const originalRestore = oktaAuth.options.restoreOriginalUri;
    oktaAuth.options.restoreOriginalUri = restoreOriginalUri;
    onCleanup(() => {
      oktaAuth.options.restoreOriginalUri = originalRestore;
    });
  });

  onMount(() => {
    oktaAuth.authStateManager.subscribe((state) => {
      setAuthState({
        isAuthenticated: state.isAuthenticated,
        user: state.idToken?.claims || null
      });
    });
    // 최초 상태 동기화
    oktaAuth.authStateManager.updateAuthState();
  });

  return (
    <OktaContext.Provider value={{ oktaAuth, authState }}>
      {props.children}
    </OktaContext.Provider>
  );
}