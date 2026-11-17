import { useState } from 'react';
import { useFlight } from '../../context/FlightContext';
import { SEAT_CATEGORIES, MEAL_OPTIONS } from '../../data/flightData';
import styles from './PriceSummary.module.css';

export default function PriceSummary() {
  const {
    state,
    getSeatPrice,
    totalSeatCost,
    totalMealCost,
    subtotalCost,
    gstTax,
    grandTotal,
    applyCoupon,
    removeCoupon,
    setIsBoardingModalOpen,
  } = useFlight();

  const [couponInput, setCouponInput] = useState('');

  const assignedPassengers = state.passengers.filter((p) => p.seatId);
  const unassignedPassengers = state.passengers.filter((p) => !p.seatId);
  const passengersWithMeals = state.passengers.filter((p) => p.mealId && p.mealId !== 'none');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  return (
    <div className={styles.summaryCard} aria-label="Cost and Fare Summary">
      {/* Title */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.receiptIcon}>🧾</span>
          <h2 className={styles.title}>Fare Breakdown</h2>
        </div>
        <span className={styles.flightTag}>AI-SS402</span>
      </div>

      {assignedPassengers.length === 0 && passengersWithMeals.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>✈️</div>
          <p className={styles.emptyTitle}>No ancillary services selected</p>
          <p className={styles.emptySub}>
            Select seats on the aircraft map or meals below to see the real-time breakdown.
          </p>
        </div>
      ) : (
        <div className={styles.breakdownList}>
          {/* Seat Charges Section */}
          {assignedPassengers.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>SEAT SELECTION FEES</span>
                <span className={styles.sectionCount}>({assignedPassengers.length})</span>
              </div>

              {assignedPassengers.map((p) => {
                const seat = state.layout.seats[p.seatId];
                const cat = seat ? SEAT_CATEGORIES[seat.category] : null;
                const price = getSeatPrice(p.seatId);

                return (
                  <div key={p.id} className={styles.rowItem}>
                    <div className={styles.rowLeft}>
                      <span
                        className={styles.seatPill}
                        style={{ background: cat ? cat.color : '#2563eb' }}
                      >
                        {p.seatId}
                      </span>
                      <div className={styles.rowDetails}>
                        <span className={styles.passengerName}>{p.name}</span>
                        <span className={styles.seatCategory}>{cat?.label}</span>
                      </div>
                    </div>
                    <span className={styles.rowPrice}>
                      {price === 0 ? <span className={styles.freeText}>FREE</span> : `₹${price}`}
                    </span>
                  </div>
                );
              })}

              <div className={styles.subtotalRow}>
                <span>Seat Subtotal</span>
                <span>₹{totalSeatCost}</span>
              </div>
            </div>
          )}

          {/* Meal Charges Section */}
          {passengersWithMeals.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>PRE-ORDER MEALS</span>
                <span className={styles.sectionCount}>({passengersWithMeals.length})</span>
              </div>

              {passengersWithMeals.map((p) => {
                const meal = MEAL_OPTIONS.find((m) => m.id === p.mealId);
                if (!meal) return null;

                return (
                  <div key={p.id} className={styles.rowItem}>
                    <div className={styles.rowLeft}>
                      <span className={styles.mealEmoji}>{meal.emoji}</span>
                      <div className={styles.rowDetails}>
                        <span className={styles.passengerName}>{p.name}</span>
                        <span className={styles.seatCategory}>{meal.label}</span>
                      </div>
                    </div>
                    <span className={styles.rowPrice}>
                      {meal.price === 0 ? <span className={styles.freeText}>FREE</span> : `₹${meal.price}`}
                    </span>
                  </div>
                );
              })}

              <div className={styles.subtotalRow}>
                <span>Meal Subtotal</span>
                <span>₹{totalMealCost}</span>
              </div>
            </div>
          )}

          {/* Tax / GST Section */}
          <div className={styles.taxSection}>
            <div className={styles.taxRow}>
              <span>Services Subtotal</span>
              <span>₹{subtotalCost}</span>
            </div>
            <div className={styles.taxRow}>
              <span>GST &amp; Aviation Taxes (5%)</span>
              <span>₹{gstTax}</span>
            </div>
            {state.discountAmount > 0 && (
              <div className={`${styles.taxRow} ${styles.discountRow}`}>
                <span>Coupon ({state.couponCode})</span>
                <span>-₹{state.discountAmount}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promo Code Input */}
      <div className={styles.couponBlock}>
        {state.discountAmount > 0 ? (
          <div className={styles.couponApplied}>
            <div className={styles.appliedLeft}>
              <span>🎉 Coupon <strong>{state.couponCode}</strong> applied</span>
              <span className={styles.discountLabel}>-₹{state.discountAmount} off</span>
            </div>
            <button
              type="button"
              className={styles.removeCouponBtn}
              onClick={removeCoupon}
            >
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
            <input
              type="text"
              placeholder="Promo code (e.g. FLYHIGH)"
              className={styles.couponInput}
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button type="submit" className={styles.couponBtn}>
              Apply
            </button>
          </form>
        )}
      </div>

      {/* Grand Total Box */}
      <div className={styles.totalBox}>
        <div className={styles.totalLeft}>
          <span className={styles.totalLabel}>TOTAL PAYABLE</span>
          <span className={styles.taxInclusive}>Includes all applicable taxes</span>
        </div>
        <div className={styles.totalValue}>₹{grandTotal}</div>
      </div>

      {/* Unassigned Warning Notice */}
      {unassignedPassengers.length > 0 && (
        <div className={styles.unassignedNotice}>
          ⚠️ {unassignedPassengers.length} of {state.passengers.length} passenger{unassignedPassengers.length > 1 ? 's' : ''} still need seat assignment.
        </div>
      )}

      {/* Confirm & Boarding Pass Action Button */}
      <button
        type="button"
        className={styles.checkoutBtn}
        onClick={() => setIsBoardingModalOpen(true)}
      >
        <span>Confirm &amp; View Boarding Passes</span>
        <span>→</span>
      </button>
    </div>
  );
}
