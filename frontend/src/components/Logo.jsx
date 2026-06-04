import logo from "../assets/logo.png";

const sizeClass = {
  small: "logo-small",
  medium: "logo-medium",
  large: "logo-large"
};

function Logo({ size = "medium", showText = true, className = "" }) {
  return (
    <div className={`logo-lockup ${sizeClass[size] || sizeClass.medium} ${className}`}>
      <img className="logo-image" src={logo} alt="MediLens AI logo" />
      {showText && (
        <div className="logo-text">
          <h1>MediLens <span>AI</span></h1>
          <p>Medicine Understanding Assistant</p>
        </div>
      )}
    </div>
  );
}

export default Logo;
