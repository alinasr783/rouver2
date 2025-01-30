import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../lib/supabase.js";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import "../css/signup.css";
import { app } from '../../lib/firebase.js';

function CircularIndeterminate() {
  return (
    <Box sx={{ display: 'flex', color: '#fff' }}>
      <CircularProgress sx={{ color: 'white' }} size={25} />
    </Box>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const auth = getAuth(app); // Firebase Authentication instance
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await createUserColumn();
      navigate('/'); 
    } catch (err) {
      handleFirebaseError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFirebaseError = (err) => {
    switch (err.code) {
      case 'auth/email-already-in-use':
        setError("Email already exists.");
        break;
      case 'auth/weak-password':
        setError("Password is too weak.");
        break;
      default:
        setError("Unexpected error occurred.");
    }
  };

  const createUserColumn = async () => {
    try {
      const insertIntoTable = async (tableName) => {
        const { data, error } = await supabase.from(tableName).insert([{ email }]);
        if (error) throw new Error(`Error inserting into ${tableName} table: ${error.message}`);
        return data;
      };

      await Promise.all([
        insertIntoTable("user"),
        insertIntoTable("identity"),
        insertIntoTable("cart"),
        insertIntoTable("wishlist"),
      ]);

      console.log("Email inserted successfully into user, identity, cart, and wishlist tables.");
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  return (
    <div className='signup'>
      <div className='signup-content'>
        <div className='signup-content-img'>
          <img src="https://i.ibb.co/vDZcMPF/photo-1574182245530-967d9b3831af.jpg" alt="Signup" />
        </div>
        <div className='signup-content-title'>Trendy man بتحبك ❤️ </div>
        <div className='signup-content-des'>عامل اي يا عسل 😘
        عشان تسجل معانا محتاجين شوية بيانات صغننة قد كدا 🤏🏻 
        </div>
        <div className='signup-content-inputs'>
          <div className='signup-content-inputs-input-email'>
            <div className='signup-content-inputs-input-title'>Email</div>
            <input
              className={`${error ? "error" : ""}`}
              type='email'
              placeholder='Enter your email'
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className='signup-content-inputs-input-error'>
              {error && error.includes("Email") ? error : ""}
            </div>
          </div>
          <div className='signup-content-inputs-input-password'>
            <div className='signup-content-inputs-input-title'>Password</div>
            <input
              type='password'
              placeholder='Create a new password'
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='signup-content-inputs-input-error'>
              {error && error.includes("password") ? error : ""}
            </div>
          </div>
        </div>
        <button className='signup-content-button' onClick={handleSubmit}>
          {loading ? <CircularIndeterminate /> : "Create Account"}
        </button>
        <button className="signup-content-login" onClick={() => navigate("/login")}>
          Already have an account? <a >Login</a>
        </button>
        {/* <div className='signup-content-rights'>
          <p></p>
        </div> */}
      </div>
    </div>
  );
}