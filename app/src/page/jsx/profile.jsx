import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";

export default function Profile(){
  return(
    <>
      <Header title={"My Profile"} />
      <BottomHeader />
    </>
  )
}