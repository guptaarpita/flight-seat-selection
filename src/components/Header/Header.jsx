import { useFlight } from '../../context/FlightContext';
import { FLIGHT_INFO } from '../../data/flightData';
import styles from './Header.module.css';

export default function Header() {
  const { state, setIsBoardingModalOpen, grandTotal } = useFlight();

  const assignedCount = state.passengers.filter((p) => p.seatId).length;
  const totalCount = state.passengers.length;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo & Brand */}
        <div className={styles.logoGroup}>
          <div className={styles.logoBadge}>
            <span className={styles.logoIcon}>✈</span>
          </div>
          <div>
            <h1 className={styles.logoText}>
              Sky<span className={styles.logoAccent}>Select</span>
            </h1>
            <span className={styles.airlineName}>{FLIGHT_INFO.airline}</span>
          </div>
        </div>

        {/* Flight summary pill */}
        <div className={styles.flightPill}>
          <div className={styles.flightRoute}>
            <span className={styles.routeAirport}>{FLIGHT_INFO.departure.code}</span>
            <span className={styles.flightArrow}>✈</span>
            <span className={styles.routeAirport}>{FLIGHT_INFO.arrival.code}</span>
          </div>
          <div className={styles.flightDivider} />
          <div className={styles.flightDetails}>
            <span className={styles.flightNum}>{FLIGHT_INFO.flightNumber}</span>
            <span className={styles.flightDate}>{FLIGHT_INFO.departure.date}</span>
          </div>
        </div>

        {/* Progress & Quick Action */}
        <div className={styles.rightActions}>
          <div className={styles.seatProgress}>
            <span className={styles.progressLabel}>Seats Selected</span>
            <span className={styles.progressValue}>
              <strong className={assignedCount === totalCount ? styles.allAssigned : ''}>
                {assignedCount}
              </strong>
              /{totalCount}
            </span>
          </div>

          <button
            className={styles.viewPassBtn}
            onClick={() => setIsBoardingModalOpen(true)}
            aria-label="View Boarding Passes"
          >
            <span>🎫 Passes</span>
            <span className={styles.headerTotalPill}>₹{grandTotal}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
