import { Component, createSignal } from 'solid-js';
import { useOkta  } from '../components/OktaProvider.jsx'; // SolidJS용 Okta 훅 가정

const BootstrapLogin: Component = () => {
  const { oktaAuth } = useOkta ();
  const [username, setUsername] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const transaction = await oktaAuth.signInWithCredentials({
        username: username(),
        password: password()
      });

      if (transaction.status === 'SUCCESS' && transaction.sessionToken) {
        await oktaAuth.signInWithRedirect({ sessionToken: transaction.sessionToken });
      } else {
        setError('로그인 실패: 추가 인증이 필요하거나 상태가 SUCCESS가 아닙니다.');
      }
    } catch (err: any) {
      setError(err.errorSummary || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="container mt-5" style={{ "max-width": "400px" }}>
      <h2 class="mb-4 text-center">로그인</h2>
      <form onSubmit={handleSubmit}>
        <div class="mb-3">
          <label for="username" class="form-label">아이디</label>
          <input
            type="text"
            class="form-control"
            id="username"
            value={username()}
            onInput={(e) => setUsername(e.currentTarget.value)}
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">비밀번호</label>
          <input
            type="password"
            class="form-control"
            id="password"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            required
          />
        </div>
        {error() && <div class="alert alert-danger" role="alert">{error()}</div>}
        <button
          type="submit"
          class="btn btn-primary w-100"
          disabled={loading()}
        >
          {loading() ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}

export default BootstrapLogin;