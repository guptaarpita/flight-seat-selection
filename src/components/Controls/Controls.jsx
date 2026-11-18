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
        {/* Aircraft Layout Selection */}
        <div className={styles.sectionBlock}>
          <div className={styles.blockTitle}>
            <span className={styles.titleIcon}>✈</span>
            <span>AIRCRAFT CONFIGURATION</span>
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
                      {layout.id === '3-2' ? '🛫' : '✈️'}
                    </span>
                  </div>
                  <div className={styles.layoutInfo}>
                    <div className={styles.layoutTitleRow}>
                      <span className={styles.layoutName}>{layout.label}</span>
                      {isActive && <span className={styles.activeBadge}>SELECTED</span>}
                    </div>
                    <span className={styles.layoutSub}>
                      {layout.id === '3-2' ? 'Airbus A320neo · Single Aisle' : 'Boeing 787 · Twin Aisle'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Passenger Count Stepper & Guest Avatars */}
        <div className={styles.sectionBlock}>
          <div className={styles.blockTitle}>
            <span className={styles.titleIcon}>👥</span>
            <span>GUEST SELECTION ({state.passengerCount} OF {MAX_PASSENGERS})</span>
          </div>
          <div className={styles.stepperContainer}>
            <div className={styles.stepper}>
              <button
                type="button"
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
                  {state.passengerCount === 1 ? 'PASSENGER' : 'PASSENGERS'}
                </span>
              </div>
              <button
                type="button"
                className={styles.stepBtn}
                onClick={() => setPassengerCount(state.passengerCount + 1)}
                disabled={state.passengerCount >= MAX_PASSENGERS}
                aria-label="Increase passenger count"
              >
                +
              </button>
            </div>

            {/* Quick Automation Actions */}
            <div className={styles.quickActions}>
              <button
                type="button"
                className={styles.autoAssignBtn}
                onClick={autoAssignAll}
                title="Automatically assign available seats to all unassigned passengers"
              >
                ⚡ Smart Auto-Assign
              </button>
              <button
                type="button"
                className={styles.clearBtn}
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
            <span className={styles.titleIcon}>🔍</span>
            <span>FILTER CABIN TIERS</span>
          </div>
          <div className={styles.filterPills}>
            <button
              type="button"
              className={`${styles.filterPill} ${state.categoryFilter === 'all' ? styles.filterActive : ''}`}
              onClick={() => setCategoryFilter('all')}
            >
              All Tiers
            </button>
            {Object.values(SEAT_CATEGORIES).map((cat) => {
              const isSelected = state.categoryFilter === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  className={`${styles.filterPill} ${isSelected ? styles.filterActive : ''}`}
                  onClick={() => setCategoryFilter(isSelected ? 'all' : cat.id)}
                >
                  <span
                    className={styles.filterDot}
                    style={{ background: cat.color }}
                  />
                  <span>{cat.shortLabel}</span>
                  <span className={styles.filterPriceTag}>
                    {cat.price === 0 ? 'Free' : `₹${cat.price}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
