import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LiveAppPreview from "../components/LiveAppPreview";
import EnvelopeExperience from "../components/EnvelopeExperience";

const LandingPage: React.FC = () => {
  const handleSearchScent = (selections: string[]) => {
    console.log("Search Scent triggered with selections:", selections);
  };

  const handleSearchMemory = (text: string) => {
    console.log("Search Memory triggered with text:", text);
  };

  return (
    <div className="landing-page-container">
      {/* Background image overlay to match premium aesthetic */}
      <div className="landing-background-overlay" />
      
      <Header />
      
      <main className="landing-main-content">
        <div className="left-preview-section">
          <LiveAppPreview />
        </div>
        
        <div className="right-envelope-section">
          <EnvelopeExperience
            onSearchScent={handleSearchScent}
            onSearchMemory={handleSearchMemory}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
