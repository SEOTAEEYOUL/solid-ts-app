// pages/LoginCallback.tsx
import { onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useOkta } from '../components/OktaProvider';

export default function LoginCallback(props: { loadingElement?: JSX.Element }) {
  const { oktaAuth } = useOkta();
  const navigate = useNavigate();

  onMount(async () => {
    console.log("[콜백 시작] URL:", window.location.href);
    console.log("[콜백 진입] URL 파라미터:", window.location.search);
    try {
      // ✅ 토큰 처리 및 세션 저장
      await oktaAuth.handleLoginRedirect();
      
      console.group("[토큰 상세 정보]");
      const accessToken = await oktaAuth.tokenManager.get('accessToken');
      const idToken = await oktaAuth.tokenManager.get('idToken');
      console.log("Access Token 유형:", typeof accessToken);
      console.log("ID Token 클레임:", idToken);
      console.log("토큰 유효성:", {
        accessTokenValid: !accessToken?.expired,
        idTokenValid: !idToken?.expired
      });
      console.log("저장소 확인:", localStorage.getItem('okta-token-storage'));
      console.groupEnd();

      navigate('/', { replace: true });
    } catch (error) {
      console.error("[콜백 실패] 상세 오류:", {
        name: error.name,
        message: error.message,
        errorCode: error.errorCode,
      });
      navigate('/login', { replace: true })
    }
  });

  return props.loadingElement || <div>인증 처리 중...</div>;
}
