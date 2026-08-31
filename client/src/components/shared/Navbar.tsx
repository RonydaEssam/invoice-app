import { Link, useNavigate } from "react-router-dom";
import './Navbar.css'
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";

function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSignOut = () => { localStorage.removeItem("token"); navigate("/login"); };

    return (
        <nav className="navbar">
            <button className="navbar-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            <span className="navbar-brand">Invoice App</span>

            <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                <Link className="navbar-link" to={'/'} onClick={() => setMenuOpen(false)}>Home</Link>
                <Link className="navbar-link" to={'/clients'} onClick={() => setMenuOpen(false)}>Clients</Link>
                <Link className="navbar-link" to={'/services'} onClick={() => setMenuOpen(false)}>Services</Link>
                <Link className="navbar-link" to={'/orders'} onClick={() => setMenuOpen(false)}>Orders</Link>
                <Link className="navbar-link" to={'/invoices'} onClick={() => setMenuOpen(false)}>Invoices</Link>

                <button className="navbar-signout" onClick={handleSignOut}>Sign Out</button>
            </div>

            <label className="theme-switch">
                <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={toggleTheme}
                />
                <span className="theme-switch-track">
                    <span className="theme-switch-thumb"></span>
                </span>
            </label>
        </nav>
    )
}

export default Navbar