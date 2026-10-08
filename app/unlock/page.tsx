import UnlockForm from "./UnlockForm";

export default function UnlockPage() {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-emoji">🔑</div>
        <p className="auth-eyebrow">Owner access</p>
        <h1>Welcome back</h1>
        <p className="auth-text">Enter your passcode to unlock editing on this device.</p>
        <UnlockForm />
      </div>
    </div>
  );
}
