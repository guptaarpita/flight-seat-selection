import { useState } from 'react';
import { FlightProvider, useFlight } from './context/FlightContext';
import Header from './components/Header/Header';
import Controls from './components/Controls/Controls';
import PassengerPanel from './components/PassengerPanel/PassengerPanel';
import SeatMap from './components/SeatMap/SeatMap';
import PriceSummary from './components/PriceSummary/PriceSummary';
import MealSelection from './components/MealSelection/MealSelection';
import BoardingPassModal from './components/BoardingPassModal/BoardingPassModal';
import Toast from './components/Toast/Toast';
import './App.css';

function MainFlightApp() {
  const { activePassenger, grandTotal, setIsBoardingModalOpen, state } = useFlight();
  // Mobile active tab: 'map' | 'guests' | 'fare' | 'meals'
  const [mobileTab, setMobileTab] = useState('map');

  const assignedCount = state.passengers.filter((p) => p.seatId).length;
  const totalCount = state.passengers.length;

  return (
    <div className="app">
      {/* Toast Notification Container */}
      <Toast />

      {/* Boarding Pass Preview Modal */}
      <BoardingPassModal />

      {/* Main App Navigation Header */}
      <Header />

      {/* Global Configuration Controls (Layout, Passenger count, Filters) */}
      <Controls />

      {/* Mobile Tab Switcher (< 768px) */}
      <div className="mobileTabSwitcher" role="tablist" aria-label="Mobile View Navigation">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'map'}
          className={`mobileTabBtn ${mobileTab === 'map' ? 'mobileTabActive' : ''}`}
          onClick={() => setMobileTab('map')}
        >
          <span className="mobileTabIcon">✈️</span>
          <span>Seat Map</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'guests'}
          className={`mobileTabBtn ${mobileTab === 'guests' ? 'mobileTabActive' : ''}`}
          onClick={() => setMobileTab('guests')}
        >
          <span className="mobileTabIcon">👥</span>
          <span>Guests ({assignedCount}/{totalCount})</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'meals'}
          className={`mobileTabBtn ${mobileTab === 'meals' ? 'mobileTabActive' : ''}`}
          onClick={() => setMobileTab('meals')}
        >
          <span className="mobileTabIcon">🍽️</span>
          <span>Meals</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === 'fare'}
          className={`mobileTabBtn ${mobileTab === 'fare' ? 'mobileTabActive' : ''}`}
          onClick={() => setMobileTab('fare')}
        >
          <span className="mobileTabIcon">🧾</span>
          <span>Fare (₹{grandTotal})</span>
        </button>
      </div>

      {/* Main Seat Selection Workspace */}
      <main className="mainContent" id="seat-selection-main">
        {/* Left Column: Passenger Cards & Live Fare Breakdown */}
        <aside className={`sidebarCol ${mobileTab !== 'guests' && mobileTab !== 'fare' ? 'hideOnMobile' : ''}`}>
          <div className={mobileTab === 'fare' ? 'hideOnMobileSection' : ''}>
            <PassengerPanel />
          </div>
          <div className={mobileTab === 'guests' ? 'hideOnMobileSection' : ''}>
            <PriceSummary />
          </div>
        </aside>

        {/* Center / Right Column: Fuselage Aircraft Cabin */}
        <section
          className={`seatMapCol ${mobileTab !== 'map' ? 'hideOnMobile' : ''}`}
          aria-label="Interactive Seat Map"
        >
          <div className="seatMapCard">
            <div className="cardHeader">
              <div className="cardHeaderLeft">
                <span className="cabinIcon">✈️</span>
                <div>
                  <h2 className="cardTitle">Select Aircraft Seats</h2>
                  <p className="cardSubtitle">
                    Active Guest: <strong>{activePassenger?.name}</strong>
                  </p>
                </div>
              </div>

              <div className="tipBadge">
                💡 Click seat again to unassign
              </div>
            </div>

            <SeatMap />
          </div>
        </section>
      </main>

      {/* In-Flight Meal Dining Experience (Bonus Feature) */}
      <section
        className={`mealSection ${mobileTab !== 'meals' ? 'hideOnMobile' : ''}`}
        id="meal-selection-section"
      >
        <MealSelection />
      </section>

      {/* Floating Bottom Quick Action Bar on Mobile */}
      <div className="mobileBottomBar" aria-label="Quick booking summary">
        <div className="mobileBarLeft">
          <span className="mobileActiveGuest">Guest: {activePassenger?.name?.split(' ')[0]}</span>
          <span className="mobileTotal">₹{grandTotal}</span>
        </div>
        <div className="mobileBarRight">
          {mobileTab !== 'map' && (
            <button
              type="button"
              className="mobileBackToMapBtn"
              onClick={() => setMobileTab('map')}
            >
              ← Seat Map
            </button>
          )}
          <button
            type="button"
            className="mobileCtaBtn"
            onClick={() => setIsBoardingModalOpen(true)}
          >
            Boarding Passes →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footerInner">
          <p className="footerBrand">
            ✈ <strong>SkySelect Airlines</strong> · Flight Seat Selection &amp; Passenger Management
          </p>
          <p className="footerCredits">
            Built with React 19 + Vite · Fully Responsive Across All Devices
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <FlightProvider>
      <MainFlightApp />
    </FlightProvider>
  );
}
