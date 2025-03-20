import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import CardSection from "./CardSection";

const TrackProgress = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  return (
    <div>
      {/* Cards section start  */}
      <CardSection />
      {/* Cards section end  */}
    </div>
  );
};

export default TrackProgress;
