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

  const handleQuickCoupon = (code) => {
    setCouponInput(code);
    applyCoupon(code);
  };

  return (
    <div className={styles.summaryCard} aria-label="Cost and Fare Summary">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitleGroup}>
          <div className={styles.receiptBadge}>🧾</div>
          <div>
            <h2 className={styles.title}>Fare Breakdown</h2>
            <span className={styles.subtitle}>Flight SS-402 · Ancillary Summary</span>
          </div>
        </div>
        <span className={styles.liveTag}>LIVE FARE</span>
      </div>

      {assignedPassengers.length === 0 && passengersWithMeals.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💺</div>
          <p className={styles.emptyTitle}>No Ancillary Services Added</p>
          <p className={styles.emptySub}>
            Select seats on the aircraft layout above or pre-order dining below to calculate your live total.
          </p>
        </div>
      ) : (
        <div className={styles.breakdownList}>
          {/* Seat Charges Section */}
          {assignedPassengers.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>SEAT ALLOCATIONS</span>
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
                <span>Seat Selection Subtotal</span>
                <span>₹{totalSeatCost}</span>
              </div>
            </div>
          )}

          {/* Meal Charges Section */}
          {passengersWithMeals.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>IN-FLIGHT DINING</span>
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
                <span>Dining Subtotal</span>
                <span>₹{totalMealCost}</span>
              </div>
            </div>
          )}

          {/* Taxes & Fees Section */}
          <div className={styles.taxSection}>
            <div className={styles.taxRow}>
              <span>Services Subtotal</span>
              <span>₹{subtotalCost}</span>
            </div>
            <div className={styles.taxRow}>
              <span>Aviation GST &amp; Airport Tax (5%)</span>
              <span>₹{gstTax}</span>
            </div>
            {state.discountAmount > 0 && (
              <div className={`${styles.taxRow} ${styles.discountRow}`}>
                <span>Coupon Discount ({state.couponCode})</span>
                <span>-₹{state.discountAmount}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Promo Code Input & Quick Apply */}
      <div className={styles.couponBlock}>
        {state.discountAmount > 0 ? (
          <div className={styles.couponApplied}>
            <div className={styles.appliedLeft}>
              <span>🎉 Promo <strong>{state.couponCode}</strong> Applied</span>
              <span className={styles.discountLabel}>-₹{state.discountAmount} Discount</span>
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
          <div>
            <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
              <input
                type="text"
                placeholder="Promo Code (FLYHIGH / SKYFIRST)"
                className={styles.couponInput}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="submit" className={styles.couponBtn}>
                Apply
              </button>
            </form>
            <div className={styles.quickCoupons}>
              <span className={styles.quickLabel}>Try:</span>
              <button
                type="button"
                className={styles.quickChip}
                onClick={() => handleQuickCoupon('FLYHIGH')}
              >
                FLYHIGH (-₹150)
              </button>
              <button
                type="button"
                className={styles.quickChip}
                onClick={() => handleQuickCoupon('SKYFIRST')}
              >
                SKYFIRST (-₹100)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Grand Total Display */}
      <div className={styles.totalBox}>
        <div className={styles.totalLeft}>
          <span className={styles.totalLabel}>TOTAL ANCILLARY FARE</span>
          <span className={styles.taxInclusive}>Includes all applicable taxes &amp; fees</span>
        </div>
        <div className={styles.totalValue}>₹{grandTotal}</div>
      </div>

      {/* Unassigned Guest Warning */}
      {unassignedPassengers.length > 0 && (
        <div className={styles.unassignedNotice}>
          ⚠️ {unassignedPassengers.length} of {state.passengers.length} passenger{unassignedPassengers.length > 1 ? 's' : ''} unassigned.
        </div>
      )}

      {/* Boarding Passes CTA */}
      <button
        type="button"
        className={styles.checkoutBtn}
        onClick={() => setIsBoardingModalOpen(true)}
      >
        <span>Confirm &amp; View Boarding Passes</span>
        <span className={styles.arrowIcon}>→</span>
      </button>
    </div>
  );
}
