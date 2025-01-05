import "./styles/Header.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Crown,
  Info,
  KeyboardIcon,
  KeyboardSecondIcon,
  Settings,
  Profile,
  Logout,
} from "./../assets/icons/HeaderIcons";
import NotificationModal from "./Modal/NotificationModal";
import { useAuthContext } from "../context/AuthContext";
import useLogout from "../hooks/useLogout";
import { useWordsStore } from "../store/useWords";

const Header = () => {
  const { authUser } = useAuthContext();
  const { logout } = useLogout();
  const { restart } = useWordsStore();
  const navigate = useNavigate();
  const handleClickSecondKeyboard = () => {
    navigate("/");
    restart();
  };
  const user = JSON.parse(localStorage.getItem("user"));

  const headerIcons = [
    {
      id: 1,
      icon: Crown,
      fn: () => navigate("/leaderboard"),
    },
    {
      id: 2,
      icon: Info,
      fn: () => navigate("/about"),
    },
    {
      id: 3,
      icon: Settings,
      fn: () => navigate("/settings"),
    },
  ];

  const handleTitleClick = (e) => {
    e.preventDefault();
    restart();
    navigate("/dashboard");
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="header">
      <div className="keyboard-icon"></div>
      <span className="header-title" onClick={(e) => handleTitleClick(e)}>
        <img src="/src/assets/images/SongType.com.svg"></img>
      </span>
      <div className="header-icons">
        {headerIcons.map((icon) => (
          <div key={icon.id} onClick={icon.fn} className="header-button-div">
            <icon.icon />
          </div>
        ))}
      </div>

      <div className="profile-icons">
        <div className="header-icons">
          {authUser ? (
            <>
              <div className="group">
                <Link className="profile-icon" to="profile">
                  <Profile />
                  <span className="header-username">{authUser.username}</span>
                </Link>
              </div>
            </>
          ) : (
            ""
          )}

          <NotificationModal />

          {authUser ? (
            <div onClick={handleLogOut} className="cursor-pointer">
              <Logout />
            </div>
          ) : (
            <Link to="/profile">
              <Profile />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
