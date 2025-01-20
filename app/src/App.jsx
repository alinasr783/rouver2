import { Routes, Route } from 'react-router-dom';
import Signup from './page/jsx/signup.jsx';
import Login from './page/jsx/login.jsx';
import Home from './page/jsx/home.jsx';
import Category from './page/jsx/category.jsx';
import Cart from './page/jsx/cart.jsx';
import Profile from './page/jsx/profile.jsx';
import Wishlist from './page/jsx/wishlist.jsx';
import Orders from './page/jsx/orders.jsx';
function App() {
  return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
  );
}

export default App;