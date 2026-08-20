import React from "react";

const Footer: React.FC = () => {
  const menuItems = ["Privacy Policy", "Terms of Service", "Sustainability", "Contact Us"];

  return (
    <footer className="landing-footer">
      <div className="footer-logo">DIPTYQUE</div>
      
      <nav className="footer-nav">
        {menuItems.map((item) => (
          <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} className="footer-nav-item">
            {item}
          </a>
        ))}
      </nav>

      <div className="footer-copyright">
        © 2024 DIPTYQUE PARIS. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
};

export default Footer;
