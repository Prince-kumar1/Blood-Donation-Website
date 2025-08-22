import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../../styles/Layout.css";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <div className="sidebar">
        <div className="menu">
          {user?.role === "organisation" && (
            <>
              <Link
                to="/"
                className={`menu-item ${location.pathname === "/" && "active"}`}
              >
                <i className="fa-solid fa-cubes"></i>
                <span>Inventory</span>
              </Link>
              <Link
                to="/donar"
                className={`menu-item ${location.pathname === "/donar" && "active"}`}
              >
                <i className="fa-solid fa-hand-holding-medical"></i>
                <span>Donars</span>
              </Link>
              <Link
                to="/hospital"
                className={`menu-item ${location.pathname === "/hospital" && "active"}`}
              >
                <i className="fa-solid fa-truck-medical"></i>
                <span>Hospitals</span>
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link
                to="/donar-list"
                className={`menu-item ${location.pathname === "/donar-list" && "active"}`}
              >
                <i className="fa-solid fa-hand-holding-medical"></i>
                <span>Donar List</span>
              </Link>
              <Link
                to="/hospital-list"
                className={`menu-item ${location.pathname === "/hospital-list" && "active"}`}
              >
                <i className="fa-solid fa-truck-medical"></i>
                <span>Hospital List</span>
              </Link>
              <Link
                to="/org-list"
                className={`menu-item ${location.pathname === "/org-list" && "active"}`}
              >
                <i className="fa-solid fa-hospital"></i>
                <span>Organisation List</span>
              </Link>
            </>
          )}

          {(user?.role === "donar" || user?.role === "hospital") && (
            <>
              <Link
                to="/organisation"
                className={`menu-item ${location.pathname === "/organisation" && "active"}`}
              >
                <i className="fa-solid fa-building-ngo"></i>
                <span>Organisations</span>
              </Link>
            </>
          )}

          {user?.role === "hospital" && (
            <Link
              to="/consumer"
              className={`menu-item ${location.pathname === "/consumer" && "active"}`}
            >
              <i className="fa-solid fa-users-between-lines"></i>
              <span>Consumer</span>
            </Link>
          )}
          {user?.role === "donar" && (
            <Link
              to="/donation"
              className={`menu-item ${location.pathname === "/donation" && "active"}`}
            >
              <i className="fa-solid fa-book-medical"></i>
              <span>Donations Log</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;