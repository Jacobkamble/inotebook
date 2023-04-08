import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NoteContext from "../context/notes/NoteContext";

export default function Navbar() {
  const context = useContext(NoteContext);
  const { showAlert } = context;
  let location = useLocation();
  let navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    showAlert("Logout Successfully...!!!", "success");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            iNotebook
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/" ? "active" : ""
                  } `}
                  aria-current="page"
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                  to="/about"
                >
                  About Us
                </Link>
              </li>
            </ul>

            {!localStorage.getItem("token") ? (
              <form className="d-flex" role="search">
                <Link className="btn btn-danger m-1" to="/login" role="button">
                  Login
                </Link>
                <Link className="btn btn-danger m-1" to="/signup" role="button">
                  Sign Up
                </Link>
              </form>
            ) : (
              <button onClick={handleLogout} className="btn btn-danger m-1">
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}