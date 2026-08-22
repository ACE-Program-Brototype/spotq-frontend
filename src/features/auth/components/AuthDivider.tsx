interface AuthDividerProps {
  label?: string;
  mobileLabel?: string;
}

export const AuthDivider = ({
  label = "Or continue with",
  mobileLabel = "or",
}: AuthDividerProps) => {
  return (
    <div className="relative flex items-center my-2 select-none">
      <div className="flex-grow border-t border-gray-150" />
      <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium lowercase">
        <span className="hidden md:inline">{label}</span>
        <span className="inline md:hidden">{mobileLabel}</span>
      </span>
      <div className="flex-grow border-t border-gray-150" />
    </div>
  );
};
