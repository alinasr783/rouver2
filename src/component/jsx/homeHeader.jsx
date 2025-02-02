import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase.js";
import Badge from "@mui/material/Badge";
import Skeleton from "@mui/material/Skeleton";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "@fortawesome/fontawesome-free/css/all.css";
import "../css/homeHeader.css";

export default function HomeHeader() {
  const [userData, setUserData] = useState({
    name: "",
    unreadCount: 0,
    greeting: ""
  });

  const [greetings, setGreetings] = useState(null); // لتخزين التحيات من Supabase
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // **جلب التحيات من Supabase**
  const fetchGreetings = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("setting").select("greeting").single();
      if (error) throw error;
      if (data?.greeting) {
        setGreetings(data.greeting); // تعيين التحيات بعد جلبها
      }
    } catch (error) {
      console.error("Error fetching greetings:", error.message);
    }
  }, []);

  // **تحديد التحية المناسبة حسب التوقيت**
  const getGreeting = useCallback(() => {
    if (!greetings) return "";

    const hour = new Date().getHours();
    let timePeriod = "morning";

    if (hour >= 5 && hour < 12) timePeriod = "morning";
    else if (hour >= 12 && hour < 17) timePeriod = "afternoon";
    else if (hour >= 17 && hour < 22) timePeriod = "evening";
    else timePeriod = "night";

    return greetings[timePeriod]?.[Math.floor(Math.random() * greetings[timePeriod].length)] || "";
  }, [greetings]);

  // **جلب بيانات المستخدم من Supabase**
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
    fetchGreetings(); // جلب التحيات عند تحميل الصفحة
  }, [fetchGreetings]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (greetings) {
        const greeting = getGreeting();
        setUserData(prev => ({ ...prev, greeting }));
      }

      await fetchData(user?.email);
    });

    return () => unsubscribe();
  }, [fetchData, getGreeting, greetings]);

  return (
    <div className="home-header">
      <div className="home-header-content">
        {loading ? (
          <Skeleton variant="text" width="80%" height="100%" />
        ) : (
          <div className="home-header-content-greeting" dir="rtl">
            {userData.greeting}{userData.name ? `، ${userData.name}` : ""}
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