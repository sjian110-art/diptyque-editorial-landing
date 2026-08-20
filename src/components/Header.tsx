import React from "react";

export interface HeaderProps {
  onMenuClick?: (menu: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const menuItems = ["Fragrances", "Home Decor", "Gifts", "Our Story"];

  return (
    <header className="landing-header">
      <div className="header-logo">DIPTYQUE</div>
      
      <nav className="header-nav">
        {menuItems.map((item) => (
          <button
            key={item}
            className="nav-item"
            onClick={() => onMenuClick?.(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="header-user">
        <img
          src="/assets/Web_mypage_icon.png"
          alt="User Profile"
          className="user-icon-img"
        />
      </div>
    </header>
  );
};

export default Header;
