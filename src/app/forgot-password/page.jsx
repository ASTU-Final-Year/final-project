import ForgotPasswordContent from "./forgot-password-content";

export default function ForgotPasswordPage() {
  return (
    <div
      className="bg-cover min-h-screen bg-accent flex flex-col py-16 px-4"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <ForgotPasswordContent />
    </div>
  );
}
