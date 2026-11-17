import { useFlight } from '../../context/FlightContext';
import { FLIGHT_INFO, SEAT_CATEGORIES, MEAL_OPTIONS } from '../../data/flightData';
import styles from './BoardingPassModal.module.css';

export default function BoardingPassModal() {
  const {
    state,
    isBoardingModalOpen,
    setIsBoardingModalOpen,
    getSeatPrice,
    grandTotal,
  } = useFlight();

  if (!isBoardingModalOpen) return null;

  const aircraftName =
    state.layout.id === '3-2' ? FLIGHT_INFO.aircraftNarrow : FLIGHT_INFO.aircraftWide;

  const assignedPassengers = state.passengers.filter((p) => p.seatId);
  const unassignedPassengers = state.passengers.filter((p) => !p.seatId);

  return (
    <div className={styles.backdrop} onClick={() => setIsBoardingModalOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.badge}>✈ E-Boarding Pass Preview</div>
            <h2 className={styles.title}>{FLIGHT_INFO.airline}</h2>
            <p className={styles.subtitle}>
              Flight {FLIGHT_INFO.flightNumber} · {aircraftName} · {state.layout.label}
            </p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={() => setIsBoardingModalOpen(false)}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Flight Route Banner */}
        <div className={styles.routeBanner}>
          <div className={styles.routeCity}>
            <span className={styles.cityCode}>{FLIGHT_INFO.departure.code}</span>
            <span className={styles.cityName}>{FLIGHT_INFO.departure.city}</span>
            <span className={styles.time}>{FLIGHT_INFO.departure.time}</span>
          </div>

          <div className={styles.flightFlightLine}>
            <span className={styles.duration}>{FLIGHT_INFO.duration}</span>
            <div className={styles.line}>
              <span className={styles.planeIcon}>✈</span>
            </div>
            <span className={styles.nonStop}>Non-Stop</span>
          </div>

          <div className={styles.routeCity} style={{ textAlign: 'right' }}>
            <span className={styles.cityCode}>{FLIGHT_INFO.arrival.code}</span>
            <span className={styles.cityName}>{FLIGHT_INFO.arrival.city}</span>
            <span className={styles.time}>{FLIGHT_INFO.arrival.time}</span>
          </div>
        </div>

        {/* Warning if any passenger is unassigned */}
        {unassignedPassengers.length > 0 && (
          <div className={styles.warningAlert}>
            ⚠️ Note: {unassignedPassengers.map((p) => p.name).join(', ')} do not have a seat selected yet.
          </div>
        )}

        {/* Boarding Passes List */}
        <div className={styles.passesList}>
          {state.passengers.map((passenger, index) => {
            const seat = passenger.seatId ? state.layout.seats[passenger.seatId] : null;
            const category = seat ? SEAT_CATEGORIES[seat.category] : null;
            const meal = MEAL_OPTIONS.find((m) => m.id === passenger.mealId) || MEAL_OPTIONS[0];
            const seatPrice = passenger.seatId ? getSeatPrice(passenger.seatId) : 0;

            return (
              <div key={passenger.id} className={styles.boardingPass}>
                {/* Left Pass Body */}
                <div className={styles.passMain}>
                  <div className={styles.passHeader}>
                    <span className={styles.airlineSmall}>{FLIGHT_INFO.airline}</span>
                    <span className={styles.flightGroup}>Zone 2 · Gate {FLIGHT_INFO.gate}</span>
                  </div>

                  <div className={styles.passDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>PASSENGER</span>
                      <span className={styles.detailValue}>{passenger.name}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>DATE</span>
                      <span className={styles.detailValue}>{FLIGHT_INFO.departure.date}</span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>MEAL</span>
                      <span className={styles.detailValue}>
                        {meal.emoji} {meal.label}
                      </span>
                    </div>

                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>SEAT TYPE</span>
                      <span className={styles.detailValue}>
                        {category ? category.label : 'Not Assigned'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perforated Divider */}
                <div className={styles.passDivider}>
                  <div className={styles.notchTop} />
                  <div className={styles.dashedLine} />
                  <div className={styles.notchBottom} />
                </div>

                {/* Right Stub (Seat & Barcode) */}
                <div className={styles.passStub}>
                  <div className={styles.stubSeatBlock}>
                    <span className={styles.stubSeatLabel}>SEAT</span>
                    <span
                      className={styles.stubSeatNumber}
                      style={{ color: category ? category.color : '#94a3b8' }}
                    >
                      {passenger.seatId || '—'}
                    </span>
                    <span className={styles.stubPrice}>
                      {passenger.seatId ? (seatPrice === 0 ? 'FREE' : `₹${seatPrice}`) : 'Unassigned'}
                    </span>
                  </div>

                  {/* Mock Barcode */}
                  <div className={styles.barcodeWrapper} aria-hidden="true">
                    <div className={styles.barcodeLines} />
                    <span className={styles.barcodeCode}>
                      {passenger.id.toUpperCase()}-SS402-{passenger.seatId || 'XX'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className={styles.footer}>
          <div className={styles.footerSummary}>
            <span className={styles.footerTotalLabel}>Total Ancillary Amount:</span>
            <span className={styles.footerTotalValue}>₹{grandTotal}</span>
          </div>
          <div className={styles.footerButtons}>
            <button
              className={styles.printBtn}
              onClick={() => window.print()}
              title="Print Boarding Passes"
            >
              🖨️ Print
            </button>
            <button
              className={styles.doneBtn}
              onClick={() => setIsBoardingModalOpen(false)}
            >
              Done & Return to Seat Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
