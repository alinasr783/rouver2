import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import "../css/editProfile.css";
export default function EditProfile(){
  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل
  return(
    <>
      <Header title={"Complete Profile"} back={"/profile"}/>
      <div className="edit-profile-content">
        <div className="edit-profile-content-one">
          <div className="edit-profile-content-one-img">
            <img
              src="https://i.ibb.co/b5DmQ0D/IMG-20241105-WA0030.jpg"
              alt="Ali Nasr"
              className="edit-profile-img"
            />
          </div>
          <div className="edit-profile-content-one-text">Ali Nasr</div>
        </div>
        <div className="edit-profile-content-two">
          <div className='signup-content-inputs'>
            <div className='signup-content-inputs-input-email'>
              <div className='signup-content-inputs-input-title'>Full Name</div>
              <input
                type='text'
                placeholder='Enter your name'
              />
              <div className='signup-content-inputs-input-error'>
              </div>
            </div>
            <div className='signup-content-inputs-input-password'>
              <div className='signup-content-inputs-input-title'>Phone Number</div>
              <input
                type='number'
                placeholder='Enter your phone number'
              />
              <div className='signup-content-inputs-input-error'>
              </div>
            </div>
          </div>
          <div className='signup-content-button'>
            Save Changes
          </div>
        </div>
      </div>
      <BottomHeader />
    </>
  )
}