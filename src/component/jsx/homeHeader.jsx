import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import Badge from "@mui/material/Badge";
import Skeleton from "@mui/material/Skeleton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "@fortawesome/fontawesome-free/css/all.css";
import "../css/homeHeader.css";

const GREETINGS = {
  morning: [
    "صباح الفل 🌞",
    "يوم جديد وفرصة جديدة ☀️",
    "اصحى وانطلق 🚀",
    "ابدأ يومك بطاقة حلوة 💪",
    "خليك متفائل 🌻"
  ],
  afternoon: [
    "كمل بقوة 🔥",
    "ريح شوية وكمل ⚡",
    "خطوة تقربك لهدفك 🎯",
    "اشحن طاقتك 💡",
    "وقت الإنجاز 🚀"
  ],
  evening: [
    "مساء الخير 🌙",
    "خد لحظة لنفسك 🌅",
    "وقت الاسترخاء 🏆",
    "طاقة إيجابية 🌌",
    "يومك كان رائع 🕊️"
  ],
  night: [
    "ليلة هادية 🌃",
    "نام كويس 🛌",
    "أحلام سعيدة 🌠",
    "استعد لبكرة 🔥",
    "راحة واستجمام 🌖"
  ],
};

export default function HomeHeader() {
  const [userData, setUserData] = useState({
    name: "",
    unreadCount: 0,
    greeting: ""
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    let timePeriod = "morning";

    if (hour >= 5 && hour < 12) timePeriod = "morning";
    else if (hour >= 12 && hour < 17) timePeriod = "afternoon";
    else if (hour >= 17 && hour < 22) timePeriod = "evening";
    else timePeriod = "night";

    return GREETINGS[timePeriod][
      Math.floor(Math.random() * GREETINGS[timePeriod].length)
    ];
  }, []);

  const fetchData = useCallback(async (email) => {
    try {
      const [localName, localCount] = [
        localStorage.getItem("first_name"),
        parseInt(localStorage.getItem("unread_notifications_count"), 10)
      ];

      setUserData(prev => ({
        ...prev,
        name: localName || "",
        unreadCount: localCount || 0
      }));

      if (email) {
        const [nameRes, notificationsRes] = await Promise.all([
          localName && supabase
            .from("identity")
            .select("first_name")
            .eq("email", email)
            .single(),

          supabase
            .from("notification")
            .select("id", { count: "exact" })
            .eq("email", email)
            .eq("is_read", false)
        ]);

        if (nameRes && nameRes.data && localName) {
          const newName = nameRes.data.first_name || "";
          localStorage.setItem("first_name", newName);
          setUserData(prev => ({ ...prev, name: newName }));
        }

        if (notificationsRes) {
          const newCount = notificationsRes.count || 0;
          localStorage.setItem("unread_notifications_count", newCount);
          setUserData(prev => ({ ...prev, unreadCount: newCount }));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const greeting = getGreeting();
      setUserData(prev => ({ ...prev, greeting }));

      await fetchData(user?.email);
    });

    return () => unsubscribe();
  }, [fetchData, getGreeting]);

  return (
    <div className="home-header">
      <div className="home-header-content">
        {loading ? (
          <Skeleton variant="text" width="80%" height="100%" />
        ) : (
      <div className="home-header-content-greeting" dir="rtl">
        {userData.greeting}{userData.name ?`، ${userData.name}` : ""}
      </div>
        )}

        <div className="home-header-content-notification">
          {loading ? (
            <Skeleton variant="circular" width={45} height={45} />
          ) : (
            <div
              className="home-header-content-notification-bg"
              onClick={() => navigate("/notification")}
            >
              <Badge
                badgeContent={userData.unreadCount}
                sx={{
                  "& .MuiBadge-badge": {
                    color: "#f4f4f4",
                    backgroundColor: "#37474f",
                  },
                }}
              >
                <i className="fas fa-bell"></i>
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}