import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-spotq-cream select-none font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-spotq-border text-center space-y-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          Customer Registration
        </h2>
        <p className="text-sm text-gray-500">Sign Up / Registration flow is coming soon!</p>
        <Button
          onClick={() => navigate("/login")}
          className="w-full bg-spotq-orange text-white hover:bg-spotq-orange/90 h-11 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="size-4 mr-2" /> Back to Login
        </Button>
      </div>
    </div>
  );
}
