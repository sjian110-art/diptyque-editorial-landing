import React from "react";

export interface HeaderProps {
  onMenuClick?: (menu: string) => void;
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onLogoClick }) => {
  const menuItems = ["Fragrances", "Home Decor", "Gifts", "Our Story"];

  return (
    <header className="landing-header">
      <button 
        className="header-logo-btn" 
        onClick={onLogoClick}
        aria-label="Toggle Perfume Bottle"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          textAlign: 'left'
        }}
      >
        <div className="header-logo">DIPTYQUE</div>
      </button>
      
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
