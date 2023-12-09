import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHome } from "@fortawesome/free-solid-svg-icons";
import SearchComponent from "./SearchComponent.js";

function Header({ onSearch }) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const [storedPhoneNumber, setStoredPhoneNumber] = useState("");
  const [userParam, setUserParam] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const user = params.get("user");
    setUserParam(user);
  }, []);

  const handleSignUpClick = () => {
    setShowSignUpModal(true);
  };

  const handleCloseModal = () => {
    setShowSignUpModal(false);
    setShowVerificationModal(false);
    setPhoneNumber("");
    setVerificationCode("");
    setVerificationStatus("");
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleUserIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleOptionSelect = (option) => {
    if (option === 0) {
      console.log("Selected option:", option);
    } else if (option === 1) {
      console.log("Logging out...");
      setUserParam(null); // Reset userParam to null on logout
      setShowDropdown(false); // Close the dropdown after logout
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/sendVerification",
        {
          phoneNumber: phoneNumber,
        }
      );

      console.log("Verification status:", response.data.status);
      setVerificationStatus(response.data.status);
      handleCloseModal();
      setShowVerificationModal(true);
      setStoredPhoneNumber(phoneNumber);
    } catch (error) {
      console.error("Error sending verification:", error);
    }
  };

  const handleCheckVerification = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/checkVerification",
        {
          code: verificationCode,
          phoneNumber: storedPhoneNumber,
        }
      );

      console.log("Check verification status:", response.data);
      setVerificationStatus(response.data);
      handleCloseModal();

      if (response.data.includes("approved")) {
        const signUpWindow = window.open(
          "/signUp.html",
          "_blank",
          "width=600,height=400"
        );
        if (!signUpWindow) {
          alert("Please allow popups for this website.");
        }
      }
    } catch (error) {
      console.error("Error checking verification:", error);
    }
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-start">
          <div className="navbar-item house-icon no-hover-effect">
            <FontAwesomeIcon icon={faHome} className="icon" />
          </div>
          <div className="navbar-middle">
            <SearchComponent onSearch={onSearch} />
          </div>
        </div>
        <div className="navbar-end">
          {!userParam && (
            <a href="#" className="navbar-item" onClick={handleSignUpClick}>
              Sign up
            </a>
          )}
          {!userParam && (
            <a href="login.html" className="navbar-item">
              Log in
            </a>
          )}
          {userParam && (
            <div className="user-options" style={{ position: "relative" }}>
              <a
                href={`http://localhost:3000/addProperty.html?username=${userParam}`}
                className="navbar-item"
              >
                Add property
              </a>
              <div
                className="navbar-item user-icon"
                onClick={handleUserIconClick}
              >
                <FontAwesomeIcon icon={faUser} className="icon user-avatar" />
                {showDropdown && (
                  <div className="dropdown-menu">
                    <ul>
                      <li onClick={() => handleOptionSelect(0)}>
                        My properties
                      </li>
                      <li onClick={() => handleOptionSelect(1)}>Log out</li>
                      {/* Add more options as needed */}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {showSignUpModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Sign Up</h2>
            <form>
              <label>
                Phone Number:
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                />
              </label>
              <button type="button" onClick={handleSignUp}>
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {showVerificationModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Verification Code</h2>
            <form>
              <label>
                Enter Verification Code:
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleVerificationCodeChange}
                />
              </label>
              <button type="button" onClick={handleCheckVerification}>
                Verify
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
