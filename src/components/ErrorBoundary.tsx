import { ErrorBoundary as SolidErrorBoundary } from 'solid-js';

interface ErrorBoundaryProps {
  children: any;
  fallback?: (err: any, reset: () => void) => any;
}

const DefaultFallback = (err: any, reset: () => void) => (
  <div>
    <h1>문제가 발생했습니다.</h1>
    <pre style={{ color: "red" }}>{err?.message || String(err)}</pre>
    <button onClick={reset}>다시 시도</button>
  </div>
);

const ErrorBoundary = (props: ErrorBoundaryProps) => (
  <SolidErrorBoundary fallback={props.fallback || DefaultFallback}>
    {props.children}
  </SolidErrorBoundary>
);

export default ErrorBoundary;
