import React,{useEffect} from "react";
import { useNavigate } from "react-router-dom";
import BottomHeader from "../../component/jsx/bottomHeader.jsx";
import Header from "../../component/jsx/header.jsx";
import "../css/notification.css";

// تعريف بيانات الإشعارات
const notifications = [
  {
    id: 1,
    image: "https://storage.googleapis.com/a1aa/image/WfxdqVyfaZoi0kem0S1l61klcQ0KtOYvsYQtaJOeGzzI2WdQB.jpg",
    title: "Order Shipped",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "1h"
  },
  {
    id: 2,
    image: "https://storage.googleapis.com/a1aa/image/J4nirwon6VK0JhbPixnm5mb1VvtmHVnDVb75lRIqsx6Yb1BF.jpg",
    title: "Flash Sale Alert",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "1h"
  },
  {
    id: 3,
    image: "https://storage.googleapis.com/a1aa/image/x8rW4nqZ5AIDHN22wNx39X5yna2ghgxwqLTwq9qfq27w2qDKA.jpg",
    title: "Product Review Request",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis.",
    time: "1h"
  },
  {
    id: 4,
    image: "https://storage.googleapis.com/a1aa/image/WfxdqVyfaZoi0kem0S1l61klcQ0KtOYvsYQtaJOeGzzI2WdQB.jpg",
    title: "Order Shipped",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "1d"
  },
  {
    id: 5,
    image: "https://storage.googleapis.com/a1aa/image/Mawh3reU0fv7DkAkGrClAHagZJZ2mevArrIyfvphabgB2WdQB.jpg",
    title: "New Paypal Added",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "1d"
  },
  {
    id: 6,
    image: "https://storage.googleapis.com/a1aa/image/J4nirwon6VK0JhbPixnm5mb1VvtmHVnDVb75lRIqsx6Yb1BF.jpg",
    title: "Flash Sale Alert",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "1d"
  }
];

export default function Notification() {
  useEffect(() => {
    window.scrollTo(0, 0); // التمرير إلى أعلى نقطة في الصفحة
  }, []); // [] لضمان تنفيذها مرة واحدة فقط عند التحميل

  return (
    <>
      <Header title={"Notification"} />
      <div className="notification-content">
        <div className="section">
          <div className="section-title">
            <span>TODAY</span>
            <span>Mark all as read</span>
          </div>
          {notifications.filter(notification => notification.time === "1h").map(notification => (
            <div className="notification" key={notification.id}>
              <img src={notification.image} alt={notification.title} />
              <div className="content">
                <div className="title">{notification.title}</div>
                <div className="message">{notification.message}</div>
              </div>
              <div className="time">{notification.time}</div>
            </div>
          ))}
        </div>
        <div className="section">
          <div className="section-title">
            <span>YESTERDAY</span>
            <span>Mark all as read</span>
          </div>
          {notifications.filter(notification => notification.time === "1d").map(notification => (
            <div className="notification" key={notification.id}>
              <img src={notification.image} alt={notification.title} />
              <div className="content">
                <div className="title">{notification.title}</div>
                <div className="message">{notification.message}</div>
              </div>
              <div className="time">{notification.time}</div>
            </div>
          ))}
        </div>
      </div>
      <BottomHeader />
    </>
  );
}