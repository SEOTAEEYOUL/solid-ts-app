// src/pages/TestAuth.tsx
import { useOkta } from '../components/OktaProvider';

export default function TestAuth() {
  const { oktaAuth } = useOkta();
  return (
    <button 
      onClick={() => oktaAuth.signInWithRedirect()}
      style={{ padding: '20px', fontSize: '1.2rem' }}
    >
      테스트 로그인 (최소 코드)
    </button>
  );
}
