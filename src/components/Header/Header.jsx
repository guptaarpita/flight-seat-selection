import { useFlight } from '../../context/FlightContext';
import { FLIGHT_INFO } from '../../data/flightData';
import styles from './Header.module.css';

export default function Header() {
  const { state, setIsBoardingModalOpen, grandTotal } = useFlight();

  const assignedCount = state.passengers.filter((p) => p.seatId).length;
  const totalCount = state.passengers.length;
  const isAllAssigned = assignedCount === totalCount;

  return (
    <header className={styles.header}>
      {/* Flight Status Bar */}
      <div className={styles.flightStatusBar}>
        <div className={styles.statusInner}>
          <div className={styles.flightTag}>
            <span className={styles.livePulse} />
            <span>FLIGHT {FLIGHT_INFO.flightNumber}</span>
          </div>
          <div className={styles.flightMeta}>
            <span>{FLIGHT_INFO.aircraftNarrow}</span>
            <span className={styles.dotSeparator}>•</span>
            <span>Non-Stop ({FLIGHT_INFO.duration})</span>
            <span className={styles.dotSeparator}>•</span>
            <span>Gate {FLIGHT_INFO.gate} · Terminal 3</span>
          </div>
          <div className={styles.dateTag}>{FLIGHT_INFO.departure.date}</div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className={styles.mainNav}>
        <div className={styles.inner}>
          {/* Airline Logo & Branding */}
          <div className={styles.logoGroup}>
            <div className={styles.logoBadge}>
              <span className={styles.logoIcon}>✈</span>
            </div>
            <div className={styles.logoTextGroup}>
              <div className={styles.logoBrand}>
                Sky<span className={styles.logoAccent}>Select</span>
              </div>
              <span className={styles.airlineLabel}>{FLIGHT_INFO.airline}</span>
            </div>
          </div>

          {/* Interactive Route Banner */}
          <div className={styles.routeContainer}>
            <div className={styles.airportBlock}>
              <span className={styles.airportCode}>{FLIGHT_INFO.departure.code}</span>
              <span className={styles.cityName}>{FLIGHT_INFO.departure.city}</span>
            </div>

            <div className={styles.flightPath}>
              <span className={styles.pathTime}>{FLIGHT_INFO.departure.time}</span>
              <div className={styles.flightLine}>
                <div className={styles.pathTrack} />
                <div className={styles.planeWrapper}>
                  <span className={styles.animatedPlane}>✈</span>
                </div>
              </div>
              <span className={styles.pathTime}>{FLIGHT_INFO.arrival.time}</span>
            </div>

            <div className={styles.airportBlock} style={{ textAlign: 'right' }}>
              <span className={styles.airportCode}>{FLIGHT_INFO.arrival.code}</span>
              <span className={styles.cityName}>{FLIGHT_INFO.arrival.city}</span>
            </div>
          </div>

          {/* Right Action / Progress & Passes Button */}
          <div className={styles.rightActions}>
            <div className={styles.progressCard}>
              <span className={styles.progressLabel}>SEAT PROGRESS</span>
              <div className={styles.progressBarWrapper}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${(assignedCount / totalCount) * 100}%` }}
                />
              </div>
              <span className={styles.progressNumbers}>
                <strong className={isAllAssigned ? styles.completeNumber : ''}>
                  {assignedCount}
                </strong>
                /{totalCount} assigned
              </span>
            </div>

            <button
              type="button"
              className={styles.passesBtn}
              onClick={() => setIsBoardingModalOpen(true)}
              aria-label="View Boarding Passes & Checkout"
            >
              <div className={styles.passesBtnContent}>
                <span className={styles.ticketIcon}>🎫</span>
                <div className={styles.btnText}>
                  <span className={styles.btnPrimaryText}>Boarding Passes</span>
                  <span className={styles.btnPricePill}>₹{grandTotal}</span>
                </div>
              </div>
              <div className={styles.btnShimmer} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
