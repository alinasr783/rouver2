import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import Skeleton from '@mui/material/Skeleton';
import "../css/notification.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (
    date.toDateString() ===
    new Date(today.setDate(today.getDate() - 1)).toDateString()
  ) {
    return "Yesterday";
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [email, setEmail] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // حالة عرض النافذة المنبثقة

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      } else {
        setEmail(null);
        setShowPopup(true); // عرض النافذة إذا لم يكن هناك تسجيل دخول
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!email) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("notification")
        .select("*")
        .eq("email", email)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      } else {
        setNotifications(data);
      }

      setLoading(false);
    };

    fetchNotifications();
  }, [email]);

  const filteredNotifications =
    filter === "All"
      ? notifications
      : notifications.filter(
          (notification) =>
            notification.tag?.toLowerCase() === filter.toLowerCase()
        );

  const groupedNotifications = filteredNotifications.reduce((acc, notification) => {
    const dateKey = formatDate(notification.created_at);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(notification);
    return acc;
  }, {});

  const markAllAsRead = (dateKey) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        formatDate(notification.created_at) === dateKey
          ? { ...notification, is_read: true }
          : notification
      )
    );
  };

  const handleNotificationClick = async (id) => {
    const { error } = await supabase
      .from("notification")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error updating notification:", error);
    } else {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, is_read: true } : notification
        )
      );
    }
  };

  const handleDoubleClick = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleSignUp = () => {
    setShowPopup(false); // إخفاء النافذة
    // إعادة توجيه المستخدم لصفحة التسجيل
    navigate("/signup");
  };

  if (loading) {
    return (
      <>
        <Header title={"Notification"} />
        <div className="filter-buttons">
          {["All", "Order", "News", "Discounts", "Features"].map((category) => (
            <button
              key={category}
              className={`filter-button ${filter === category ? "active" : ""}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="notification-content">
          {[...Array(5)].map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={80} style={{ marginBottom: '10px' }} />
          ))}
        </div>
        <BottomHeader />
      </>
    );
  }

  return (
    <>
      <Header title={"Notification"} />
      <div className="filter-buttons">
        {["All", "Order", "News", "Discounts", "Features"].map((category) => (
          <button
            key={category}
            className={`filter-button ${filter === category ? "active" : ""}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="notification-content">
        {Object.keys(groupedNotifications).length === 0 ? (
          <p className="no-notifications">No notifications available.</p>
        ) : (
          Object.keys(groupedNotifications).map((dateKey) => (
            <div key={dateKey} className="section">
              <div className="section-title">
                <span>{dateKey}</span>
                <span onClick={() => markAllAsRead(dateKey)}>Mark all as read</span>
              </div>
              {groupedNotifications[dateKey].map((notification) => (
                <div
                  key={notification.id}
                  className={`notification ${notification.is_read ? "read" : ""}`}
                  onClick={() => handleNotificationClick(notification.id)}
                  onDoubleClick={() => handleDoubleClick(notification.id)}
                >
                  <img src={notification.image} alt={notification.title} />
                  <div className="content">
                    <div className="title">{notification.title}</div>
                    <div className="message">{notification.message}</div>
                  </div>
                  <div className="time">
                    {new Date(notification.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
      <BottomHeader />

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Sign Up Now!</h3>
            <p>You need to create an account to view notifications.</p>
            <button onClick={handleSignUp} className="signup-btn">
              Sign Up Now
            </button>
          </div>
        </div>
      )}
    </>
  );
}