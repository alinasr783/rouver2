import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import "../css/login.css";

// مكون التحميل
function CircularIndeterminate() {
  return (
    <Box sx={{ display: "flex", color: "#fff" }}>
      <CircularProgress sx={{ color: "white" }} size={25} />
    </Box>
  );
}

export default function Login() {
  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      const auth = getAuth(); // الحصول على كائن المصادقة من Firebase
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // التوجيه إلى الصفحة الرئيسية عند نجاح تسجيل الدخول
    } catch (err) {
      console.error("Error logging in:", err.message);
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    navigate("/signup")
  }

  return (
    <div className="login">
      <div className="login-content">
        <div className="login-content-img">
          <img src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg" alt="Login" />
        </div>
        <div className="login-content-title">🤍 اهلا يا عسل</div>
        <div className="login-content-des">
          اليومين دول في حالات انتحال للشخصيات المهمة والعظيمة زيك😎  
          عشان كدا  عايزينك تدخل بيانات حسابك عشان نتأكد ان محدش بيحاول ينتحل شخصيتك 🧐
        </div>
        <div className="login-content-inputs">
          <div className="login-content-inputs-input-email">
            <div className="login-content-inputs-input-title">Email</div>
            <input
              className={`${error ? "error" : ""}`}
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
            <div className="login-content-inputs-input-error">
              {error && error.includes("email") ? error : ""}
            </div>
          </div>
          <div className="login-content-inputs-input-password">
            <div className="login-content-inputs-input-title">Password</div>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="login-content-inputs-input-error">
              {error && error.includes("password") ? error : ""}
            </div>
          </div>
        </div>
        <button className="login-content-button" onClick={handleSubmit}>
          {loading ? <CircularIndeterminate /> : "Login"}
        </button>
        <button className="login-content-login" onClick={handleSignUp}>
          Don't have an account?{" "}
          <a >Sign Up</a>
        </button>
        {/* <div className="login-content-rights">
          <p></p>
        </div> */}
      </div>
    </div>
  );
}