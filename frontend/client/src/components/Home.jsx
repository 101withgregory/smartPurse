import React, { useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Stats from "./Stats";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";
import TrackProgress from "./TrackProgress";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import Testimonials from "./Testimonials";
import HeroSection from "./HeroSection";
import HomeServices from "./HomeServices";
import AskedQuestions from "./AskedQuestions";
import Chatbot from "./Chatbot";
import Dashboard from "./Dashboard";
import Kitty from "./Kitty";
import Contribute from "./Contribute";
import MyKitties from "./MyKitties";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/v-admin";

  return (
    <div className="App">
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <HomeServices />
              <Stats />
              <Testimonials />
              <AskedQuestions />
              <Chatbot />
              {/* <Kitty />
              <Contribute /> */}
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/track-progress" element={<TrackProgress />} />
        <Route path="/v-admin" element={<Dashboard />} />
        <Route path="/kitty" element={<Kitty />} />
        <Route path="/my_kitties" element={<MyKitties />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="/contribute/:kittyAddress" element={<Contribute />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <Router>
    <Home />
  </Router>
);

export default App;
