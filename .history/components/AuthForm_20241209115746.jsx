import React from "react";
import '../styles/auth.css'; // sau asigură-te că stilurile sunt aplicate din globals.css

const AuthForm = ({ email, password, setEmail, setPassword, error, handleSubmit, buttonText, className }) => {
  return (
    <div className={`auth-form ${className}`}>
      <h1 className="auth-form-title">{buttonText}</h1>
      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-form-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-form-input"
            required
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-form-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-form-input"
            required
          />
        </div>
        {error && <p className="auth-form-error">{error}</p>}
        <button type="submit" className="auth-form-button">
          {buttonText}
        </button>
      </form>
    </div>
  );
};
  
  export default AuthForm;
  