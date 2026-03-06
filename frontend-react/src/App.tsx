import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './App.css'
import Products from './pages/Products'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import { CartProvider, useCart } from './cart/CartContext'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import MySubscriptions from './pages/MySubscriptions'
import BillingHistory from './pages/BillingHistory'
import Profile from './pages/Profile'
import AddProduct from './pages/AddProduct'

function Navbar() {
  const { items } = useCart()
  const { user, logout } = useAuth()
  const count = items.length
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand">Milkman</Link>
        <nav>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          {user?.is_staff && (
            <NavLink to="/products/new">Add Product</NavLink>
          )}
          <NavLink to="/cart">Cart{count ? ` (${count})` : ''}</NavLink>
          <button className="btn" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          {user ? (
            <>
              <NavLink to="/subscriptions">My Subscriptions</NavLink>
              <NavLink to="/billing">Billing</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <span>
                Hi, {user.username}{user.is_staff ? ' (staff)' : ' (user)'}
              </span>
              <button className="btn" onClick={() => logout()}>Logout</button>
            </>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/subscriptions" element={<MySubscriptions />} />
              <Route path="/billing" element={<BillingHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/products/new" element={<AddProduct />} />
            </Routes>
          </main>
          <footer className="footer">
            <div className="container">
              <span>© 2026 Milkman</span>
              <small>Daily dairy subscriptions made simple</small>
            </div>
          </footer>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}
