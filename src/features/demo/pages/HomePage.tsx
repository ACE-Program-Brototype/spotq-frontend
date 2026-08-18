import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/features/auth/store/auth.store";

const HomePage = () => {
  const { user, accessToken, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  if (!user) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center p-6 bg-spotq-cream font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-spotq-border text-center space-y-6">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-spotq-orange/10 text-spotq-orange">
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Lock icon"
              role="img"
            >
              <title>Lock Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome to SpotQ
            </h1>
            <p className="text-sm text-gray-500">
              Authentication is required to access your account services.
            </p>
          </div>
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-spotq-orange text-white hover:bg-spotq-orange/90 h-12 rounded-xl text-base font-semibold shadow-md cursor-pointer transition-colors"
          >
            Go to Login Page
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-[80vh] flex-col items-center justify-center p-6 bg-spotq-cream font-sans">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8 border border-spotq-border space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-label="Checked user icon"
              role="img"
            >
              <title>Success Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Secure Access Granted
          </h1>
          <p className="text-sm text-green-600 font-semibold tracking-wide uppercase">
            Successfully Authenticated
          </p>
        </div>

        <div className="border border-spotq-border rounded-2xl bg-spotq-cream/50 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-spotq-border/60 pb-3">
            <span className="text-sm text-gray-400 font-medium">Customer Name</span>
            <span className="text-base text-gray-900 font-bold">{user.fullname}</span>
          </div>
          <div className="flex justify-between items-center border-b border-spotq-border/60 pb-3">
            <span className="text-sm text-gray-400 font-medium">Email Address</span>
            <span className="text-base text-gray-900 font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between items-center border-b border-spotq-border/60 pb-3">
            <span className="text-sm text-gray-400 font-medium">Account ID</span>
            <span className="text-xs text-gray-600 font-mono select-all bg-white px-2 py-1 rounded border border-spotq-border/40">
              {user.id}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-spotq-border/60 pb-3">
            <span className="text-sm text-gray-400 font-medium">Status</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 capitalize">
              {user.status || "Active"}
            </span>
          </div>
          <div className="flex flex-col space-y-1.5 pt-1">
            <span className="text-sm text-gray-400 font-medium">Access Token</span>
            <div className="text-[10px] text-gray-500 font-mono break-all bg-white p-3 rounded-xl border border-spotq-border/40 select-all max-h-16 overflow-y-auto">
              {accessToken}
            </div>
          </div>
        </div>

        <Button
          onClick={handleLogout}
          className="w-full bg-spotq-orange text-white hover:bg-spotq-orange/90 h-12 rounded-xl text-base font-semibold shadow-md cursor-pointer transition-colors"
        >
          Logout Securely
        </Button>
      </div>
    </main>
  );
};

export default HomePage;
