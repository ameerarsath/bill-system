import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage = () => {
  return (
    <main className="premium-gradient min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Layer */}
      <div className="background-layer">
        <div className="abstract-shape shape-1"></div>
        <div className="abstract-shape shape-2"></div>
        <div className="abstract-shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="content-layer w-full max-w-md">
        <LoginForm />

        {/* Bottom Tagline */}
        <div className="text-center mt-8">
          <p className="text-white text-opacity-40 text-xs font-light tracking-wider">
            SECURE • PAPERLESS • EFFICIENT
          </p>
        </div>
      </div>
    </main>
  );
};
