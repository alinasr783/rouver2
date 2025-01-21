import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import "../css/privacy.css";
export default function Privacy(){
  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل
  return(
    <>
      <Header title={"Privacy Policy"} back={"/profile"}/>
      <div className="privacy-content">
        <div className="privacy-content-title">Cancelation Policy</div>
        <div className="privacy-content-text">
          <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from [website name] (the “Site”).</p>
          <p>When you visit the Site, we collect certain information automatically, including information about your device, such as your IP address, browser type, operating system, and the pages you visit.</p>
          <p>We also collect information about your interactions with the Site, such as the products you view, the pages you visit, and the links you click.</p>
          <p>We use this information to operate and improve the Site, to provide you with a personalized experience, and to send you marketing communications.</p>
          <p>We may share your personal information with third-party service providers who assist us in operating the Site, such as payment processors, analytics providers, and marketing platforms.</p>
          <p>We may also share your personal information if required by law or to protect the rights, property, or safety of ourselves or others.</p>
          <p>You can choose not to provide us with certain information, but this may prevent you from using some features of the Site.</p>
          <p>You can contact us at [email address] with any questions or concerns about our Privacy Policy.</p>
        </div>
        <div className="privacy-content-title">Privacy Policy</div>
        <div className="privacy-content-text">
          <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from [website name] (the “Site”).</p>
          <p>When you visit the Site, we collect certain information automatically, including information about your device, such as your IP address, browser type, operating system, and the pages you visit.</p>
          <p>We also collect information about your interactions with the Site, such as the products you view, the pages you visit, and the links you click.</p>
          <p>We use this information to operate and improve the Site, to provide you with a personalized experience, and to send you marketing communications.</p>
          <p>We may share your personal information with third-party service providers who assist us in operating the Site, such as payment processors, analytics providers, and marketing platforms.</p>
          <p>We may also share your personal information if required by law or to protect the rights, property, or safety of ourselves or others.</p>
          <p>You can choose not to provide us with certain information, but this may prevent you from using some features of the Site.</p>
          <p>You can contact us at [email address] with any questions or concerns about our Privacy Policy.</p>
        </div>
      </div>
      <BottomHeader />
    </>
  )
}