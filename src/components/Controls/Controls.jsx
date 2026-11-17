import { useFlight } from '../../context/FlightContext';
import { ALL_LAYOUTS, MAX_PASSENGERS, SEAT_CATEGORIES } from '../../data/flightData';
import styles from './Controls.module.css';

export default function Controls() {
  const {
    state,
    setLayout,
    setPassengerCount,
    clearAllSeats,
    autoAssignAll,
    setCategoryFilter,
  } = useFlight();

  const assignedCount = state.passengers.filter((p) => p.seatId).length;

  return (
    <section className={styles.controlsBar} aria-label="Flight Configuration Bar">
      <div className={styles.inner}>
        {/* Layout Selection */}
        <div className={styles.sectionBlock}>
          <div className={styles.blockTitle}>
            <span>AIRCRAFT SEATING CONFIGURATION</span>
          </div>
          <div className={styles.layoutGroup}>
            {ALL_LAYOUTS.map((layout) => {
              const isActive = state.layout.id === layout.id;
              return (
                <button
                  key={layout.id}
                  className={`${styles.layoutCard} ${isActive ? styles.activeCard : ''}`}
                  onClick={() => setLayout(layout)}
                  aria-pressed={isActive}
                >
                  <div className={styles.layoutIconWrapper}>
                    <span className={styles.layoutIcon}>
                      {layout.id === '3-2' ? '✈️' : '🛫'}
                    </span>
                  </div>
                  <div className={styles.layoutInfo}>
                    <span className={styles.layoutName}>{layout.label}</span>
                    <span className={styles.layoutSub}>{layout.aircraftType}</span>
                  </div>
                  {isActive && <span className={styles.activeCheck}>✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Passenger Count Stepper */}
        <div className={styles.sectionBlock}>
          <div className={styles.blockTitle}>
            <span>PASSENGERS ({state.passengerCount} OF {MAX_PASSENGERS})</span>
          </div>
          <div className={styles.stepperContainer}>
            <div className={styles.stepper}>
              <button
                className={styles.stepBtn}
                onClick={() => setPassengerCount(state.passengerCount - 1)}
                disabled={state.passengerCount <= 1}
                aria-label="Decrease passenger count"
              >
                −
              </button>
              <div className={styles.stepperValue}>
                <span className={styles.num}>{state.passengerCount}</span>
                <span className={styles.label}>
                  {state.passengerCount === 1 ? 'Guest' : 'Guests'}
                </span>
              </div>
              <button
                className={styles.stepBtn}
                onClick={() => setPassengerCount(state.passengerCount + 1)}
                disabled={state.passengerCount >= MAX_PASSENGERS}
                aria-label="Increase passenger count"
              >
                +
              </button>
            </div>

            {/* Quick action buttons */}
            <div className={styles.quickActions}>
              <button
                className={styles.quickBtn}
                onClick={autoAssignAll}
                title="Automatically assign seats to all unassigned passengers"
              >
                ⚡ Auto-Assign
              </button>
              <button
                className={`${styles.quickBtn} ${styles.dangerBtn}`}
                onClick={clearAllSeats}
                disabled={assignedCount === 0}
                title="Clear all assigned seats"
              >
                ✕ Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Category Highlight Filters */}
        <div className={styles.sectionBlock}>
          <div className={styles.blockTitle}>
            <span>HIGHLIGHT SEAT TYPE</span>
          </div>
          <div className={styles.filterPills}>
            <button
              className={`${styles.filterPill} ${state.categoryFilter === 'all' ? styles.filterActive : ''}`}
              onClick={() => setCategoryFilter('all')}
            >
              All Seats
            </button>
            {Object.values(SEAT_CATEGORIES).map((cat) => {
              const isSelected = state.categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`${styles.filterPill} ${isSelected ? styles.filterActive : ''}`}
                  onClick={() => setCategoryFilter(isSelected ? 'all' : cat.id)}
                  style={{
                    '--cat-color': cat.color,
                  }}
                >
                  <span
                    className={styles.filterDot}
                    style={{ background: cat.color }}
                  />
                  {cat.shortLabel} {cat.price === 0 ? '(Free)' : `(₹${cat.price})`}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
