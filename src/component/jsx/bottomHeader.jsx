import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  HomeActive,
  CartIcon,
  CartActive,
  WishlistIcon,
  WishlistActive,
  OrdersIcon,
  OrdersActive,
  ProfileIcon,
  ProfileActive,
} from "./icons";
import "../css/bottomHeader.css";

const NAV_ITEMS = [
  { id: "home", path: "/", icon: HomeIcon, activeIcon: HomeActive },
  { id: "cart", path: "/cart", icon: CartIcon, activeIcon: CartActive },
  { id: "wishlist", path: "/wishlist", icon: WishlistIcon, activeIcon: WishlistActive },
  { id: "orders", path: "/orders", icon: OrdersIcon, activeIcon: OrdersActive },
  { id: "profile", path: "/profile", icon: ProfileIcon, activeIcon: ProfileActive },
];

export default function BottomHeader({ vertical }) {
  const [isVertical, setIsVertical] = useState(vertical);
  const [isSmall, setIsSmall] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSmall && vertical) {
      const timer = setTimeout(() => setIsSmall(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSmall, vertical]);
  useEffect(() => {
    if (!vertical){
      setIsSmall(false);
    }
  },[vertical])
  
  const handleClick = () => {
    if (vertical && isSmall) {
      setIsSmall(false);
    }
  };

  const getActiveState = (path) => location.pathname === path;

  const handleNavigation = (path) => navigate(path);

  return (
    <div
      className={`bottom-header ${vertical && !isSmall ? "vertical" : "horizontal"} ${
        vertical && isSmall ? "small" : vertical && !isSmall ? "big" : ""
      }`}
      onClick={handleClick}
    >
      <div
        className={`bottom-header-content ${vertical && !isSmall ? "vertical" : "horizontal"} ${
          vertical && isSmall ? "small" : vertical && !isSmall ? "big" : ""
        }`}
      >
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`bottom-header-content-${item.id} ${getActiveState(item.path) ? "active" : ""} ${
              vertical ? "vertical" : ""
            } ${isSmall ? "hide" : ""}`}
            onClick={() => handleNavigation(item.path)}
          >
            <div
              className={`${item.id}-icon`}
              dangerouslySetInnerHTML={{
                __html: getActiveState(item.path) ? item.activeIcon : item.icon,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}