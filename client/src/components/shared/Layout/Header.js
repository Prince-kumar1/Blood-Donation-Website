import React, { useEffect } from 'react'
import { MdOutlineBloodtype, MdAnalytics } from "react-icons/md";
import { HiOutlineLogout, HiHome } from "react-icons/hi";
import { FaUserAlt, FaTint } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

const Header = () => {
    const { user } = useSelector(state => state.auth);
    const location = useLocation();
    
    //logout handler
    const handleLogout = () => {
        localStorage.clear();
        alert('Logout Successful!');
        window.location.reload();
    }
    
    return (
        <>
            <nav className='blood-navbar'>
                <div className="nav-container">
                    <div className="nav-brand">
                        <div className="blood-logo">
                            <FaTint className="blood-icon" />
                            <span className="logo-text">LifeStream <span className="accent">Donor</span></span>
                        </div>
                    </div>
                    
                    <ul className='nav-menu'>
                        <li className="nav-item user-welcome">
                            <span className="nav-user">
                                <FaUserAlt className="user-icon" /> 
                                Welcome <span className="user-name"> {user?.name || user?.hospitalName || user?.organisationName}</span>
                                <span className="user-role">{user?.role}</span>
                            </span>
                        </li>
                        
                        {
                            (location.pathname === '/' || location.pathname === '/donar' || location.pathname === '/hospital') ? (
                                <li className='nav-item'>
                                    <Link to='/analytics' className='nav-link analytics-link'>
                                        <MdAnalytics className="link-icon" />
                                        Analytics
                                    </Link>
                                </li>
                            ) : (
                                <li className='nav-item'>
                                    <Link to='/' className='nav-link home-link'>
                                        <HiHome className="link-icon" />
                                        Home
                                    </Link>
                                </li>
                            )
                        }
                        
                        <li className="nav-item">
                            <button className='logout-btn' onClick={handleLogout}>
                                <HiOutlineLogout className="logout-icon" /> 
                                Logout
                            </button>
                        </li>
                    </ul>
                    
                    {/* Mobile menu button (hidden on larger screens) */}
                    <div className="mobile-menu-btn">
                        <div className="menu-bar"></div>
                        <div className="menu-bar"></div>
                        <div className="menu-bar"></div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header