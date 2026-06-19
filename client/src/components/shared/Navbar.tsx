import { Link } from "react-router-dom";
import './Navbar.css'
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="navbar">
            <span className="navbar-brand">Invoice App</span>
            <Link className="navbar-link" to={'/'}>Home</Link>
            <Link className="navbar-link" to={'/clients'}>Clients</Link>
            <Link className="navbar-link" to={'/services'}>Services</Link>
            <Link className="navbar-link" to={'/orders'}>Orders</Link>
            <Link className="navbar-link" to={'/invoices'}>Invoices</Link>

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