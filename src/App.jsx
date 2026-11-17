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
  const { activePassenger, grandTotal, setIsBoardingModalOpen } = useFlight();

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

      {/* Main Seat Selection Workspace */}
      <main className="mainContent" id="seat-selection-main">
        {/* Left Column: Passenger Cards & Live Fare Breakdown */}
        <aside className="sidebarCol">
          <PassengerPanel />
          <PriceSummary />
        </aside>

        {/* Center / Right Column: Fuselage Aircraft Cabin */}
        <section className="seatMapCol" aria-label="Interactive Seat Map">
          <div className="seatMapCard">
            <div className="cardHeader">
              <div className="cardHeaderLeft">
                <span className="cabinIcon">✈️</span>
                <div>
                  <h2 className="cardTitle">Select Seats</h2>
                  <p className="cardSubtitle">
                    Active Selector: <strong>{activePassenger?.name}</strong>
                  </p>
                </div>
              </div>

              <div className="tipBadge">
                💡 Tip: Click your assigned seat again to unassign it
              </div>
            </div>

            <SeatMap />
          </div>
        </section>
      </main>

      {/* Full-width Meal Experience Section (Bonus Feature) */}
      <section className="mealSection" id="meal-selection-section">
        <MealSelection />
      </section>

      {/* Mobile Floating Bottom Bar */}
      <div className="mobileBottomBar" aria-label="Quick booking summary">
        <div className="mobileBarLeft">
          <span className="mobileActiveGuest">Guest: {activePassenger?.name?.split(' ')[0]}</span>
          <span className="mobileTotal">₹{grandTotal}</span>
        </div>
        <button
          type="button"
          className="mobileCtaBtn"
          onClick={() => setIsBoardingModalOpen(true)}
        >
          View Passes →
        </button>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footerInner">
          <p className="footerBrand">
            ✈ <strong>SkySelect Airlines</strong> · Flight Seat Selection &amp; Passenger Management
          </p>
          <p className="footerCredits">
            Built with React 19 + Vite · Clean architecture &amp; Accessible UI
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
