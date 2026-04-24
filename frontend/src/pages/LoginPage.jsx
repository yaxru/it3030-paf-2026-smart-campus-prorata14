// Member 01 - UI/UX Layout: Login page - redirects to Google OAuth2
export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-white border-2 border-white p-10 max-w-sm w-full">
        <h1 className="font-mono text-2xl uppercase tracking-widest mb-2 text-black">
          Smart Campus
        </h1>
        <p className="font-mono text-xs text-black/50 uppercase tracking-widest mb-8">
          SLIIT — PAF 2026
        </p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 border-2 border-black
                     px-4 py-3 font-mono text-sm uppercase tracking-widest
                     hover:bg-black hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
