import React from "react";
import { useParams } from "react-router-dom";
import Header from "../../component/jsx/header.jsx";

export default function Category(){
  const { name } = useParams();
  return(
    <>
      <Header title={name}/>
    </>
  )
}