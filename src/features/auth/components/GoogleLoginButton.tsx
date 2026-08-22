import { useCallback, useEffect } from "react";

interface GoogleLoginButtonProps {
  onSuccess: (response: { credential: string }) => void;
  disabled?: boolean;
}

export const GoogleLoginButton = ({ onSuccess, disabled }: GoogleLoginButtonProps) => {
  const handleCredentialResponse = useCallback(
    (response: { credential: string }) => {
      if (disabled) return;
      onSuccess(response);
    },
    [disabled, onSuccess],
  );

  useEffect(() => {
    const initGoogleSignIn = () => {
      const google = window.google;
      const buttonElem = document.getElementById("google-signin-button");
      if (google?.accounts?.id && buttonElem) {
        const parentWidth = Math.min(buttonElem.parentElement?.clientWidth || 360, 400);
        google.accounts.id.initialize({
          client_id:
            import.meta.env.VITE_GOOGLE_CLIENT_ID ||
            "your-google-client-id.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });
        google.accounts.id.renderButton(buttonElem, {
          theme: "outline",
          size: "large",
          width: parentWidth.toString(),
          text: "signup_with",
          shape: "rectangular",
        });
      }
    };

    const timer = setInterval(() => {
      if (window.google?.accounts?.id) {
        initGoogleSignIn();
        clearInterval(timer);
      }
    }, 500);

    return () => clearInterval(timer);
  }, [handleCredentialResponse]);

  return (
    <div className="w-full flex justify-center items-center h-12">
      <div className="w-full h-[40px] rounded-xl overflow-hidden flex justify-center isolation-isolate [transform:translateZ(0)]">
        <div id="google-signin-button" className="w-full flex justify-center" />
      </div>
    </div>
  );
};
