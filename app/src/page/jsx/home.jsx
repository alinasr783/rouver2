import React, { useState } from "react";
import HomeHeader from "../../component/jsx/homeHeader.jsx";
import SearchInput from "../../component/jsx/searchInput.jsx";
import HomeCarousel from "../../component/jsx/homeCarousel.jsx";
import Category from "../../component/jsx/category.jsx";
import HomeProducts from "../../component/jsx/homeProducts.jsx";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import "../css/home.css";
export default function Home() {
  const [searchMode, setSearchMode] = useState(false);

  return (
    <div className="home">
      <div className={`${searchMode ? "hide" : ""}`}>
        <HomeHeader />
      </div>
      <div className={`${searchMode ? "top" : ""}`}>
        <SearchInput setSearchMode={setSearchMode} />
      </div>
      <div className={`${searchMode ? "top" : ""}`}>
        <HomeCarousel />
        <Category />
        <HomeProducts />
        <BottomHeader />
      </div>
      <div className='home-content-rights'>
        <p>&copy; 2025 ROUVER. All Rights Reserved.</p>
      </div>
    </div>
  );
}
