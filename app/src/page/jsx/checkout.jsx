import React,{useState,useEffect} from "react"
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Header from "../../component/jsx/header.jsx";
import "../css/checkout.css";
export default function Checkout(){
  const [loading,setLoading]=useState(true)
  const [email,setEmail]=useState(null)
  const [address, SetAddress]=useState(null)
  return(
    <>
      <Header title={"Checkout"} />
      <div className="checkout-content"></div>
    </>
  )
}