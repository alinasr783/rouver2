import { Routes, Route } from 'react-router-dom';
import Signup from './page/jsx/signup.jsx';
import Login from './page/jsx/login.jsx';
import Home from './page/jsx/home.jsx';
import Category from './page/jsx/category.jsx';
import Cart from './page/jsx/cart.jsx';
import Profile from './page/jsx/profile.jsx';
import Wishlist from './page/jsx/wishlist.jsx';
import Orders from './page/jsx/orders.jsx';
import Product from './page/jsx/product.jsx';
import Notification from './page/jsx/notification.jsx';
import Settings from './page/jsx/settings.jsx';
import Privacy from './page/jsx/privacy.jsx';
import Help from './page/jsx/help.jsx';
import Address from './page/jsx/address.jsx';
import Checkout from './page/jsx/checkout.jsx';
import EditProfile from './page/jsx/editProfile.jsx';
import NewAddress from './page/jsx/newAddress.jsx';
import Order from './page/jsx/order.jsx';
import Thanks from './page/jsx/thanks.jsx';
function App() {
  return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/profile/settings" element={<Settings />} />
        <Route path="/profile/privacy" element={<Privacy />} />
        <Route path="/profile/help" element={<Help />} />
        <Route path="/profile/address" element={<Address />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/new-address" element={<NewAddress />} />
        <Route path="/order/:id" element={<Order />} />
        <Route path="/thanks" element={<Thanks />} />
      </Routes>
  );
}

export default App;
