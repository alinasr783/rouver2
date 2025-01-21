import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";

export default function Orders(){
  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل
  return(
    <>
      <Header title={"My Orders"} />
      <BottomHeader />
    </>
  )
}