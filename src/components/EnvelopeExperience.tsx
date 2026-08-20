import React from "react";
import ScentDiscoveryCard from "./ScentDiscoveryCard";

interface EnvelopeExperienceProps {
  onSearchScent: (selections: string[]) => void;
  onSearchMemory: (text: string) => void;
}

const EnvelopeExperience: React.FC<EnvelopeExperienceProps> = ({
  onSearchScent,
  onSearchMemory,
}) => {
  return (
    <div className="card-experience-wrapper">
      <ScentDiscoveryCard
        onSearchScent={onSearchScent}
        onSearchMemory={onSearchMemory}
      />
    </div>
  );
};

export default EnvelopeExperience;
