import React from "react";

// Easily modifiable URL constant
const APP_URL = "https://diptyque-shop.vercel.app/";

const LiveAppPreview: React.FC = () => {
  if (!APP_URL || APP_URL.trim() === "") {
    return (
      <div className="live-preview-container empty-preview">
        <p className="fallback-text">Vercel 애플리케이션 주소를 입력해주세요.</p>
      </div>
    );
  }

  return (
    <div className="live-preview-container">
      <iframe
        id="live-app-iframe"
        src={APP_URL}
        title="Diptyque Shop Live App"
        className="live-preview-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
};

export default LiveAppPreview;
