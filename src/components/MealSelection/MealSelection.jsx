import { useState } from 'react';
import { useFlight } from '../../context/FlightContext';
import { MEAL_OPTIONS } from '../../data/flightData';
import styles from './MealSelection.module.css';

export default function MealSelection() {
  const { state, setMeal, totalMealCost } = useFlight();
  const [activeTabPassengerId, setActiveTabPassengerId] = useState(state.passengers[0]?.id || 'p0');

  // Guard if passenger was removed
  const currentPassenger =
    state.passengers.find((p) => p.id === activeTabPassengerId) || state.passengers[0];

  return (
    <div className={styles.mealContainer} aria-label="In-Flight Dining Selection">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBox}>🍽️</div>
          <div>
            <div className={styles.titleRow}>
              <h2 className={styles.title}>In-Flight Meal Experience</h2>
              <span className={styles.bonusBadge}>BONUS FEATURE</span>
            </div>
            <p className={styles.subtitle}>
              Pre-order delicious chef-curated meals. Free and premium options available for every guest.
            </p>
          </div>
        </div>
        <div className={styles.mealTotalPill}>
          <span className={styles.mealTotalLabel}>Meal Ancillary:</span>
          <span className={styles.mealTotalValue}>₹{totalMealCost}</span>
        </div>
      </div>

      {/* Guest Switcher Tabs */}
      <div className={styles.guestTabs} role="tablist" aria-label="Guests meal tabs">
        {state.passengers.map((passenger, idx) => {
          const isSelectedTab = passenger.id === currentPassenger.id;
          const assignedMeal = MEAL_OPTIONS.find((m) => m.id === passenger.mealId) || MEAL_OPTIONS[0];

          return (
            <button
              key={passenger.id}
              role="tab"
              aria-selected={isSelectedTab}
              className={`${styles.guestTab} ${isSelectedTab ? styles.guestTabActive : ''}`}
              onClick={() => setActiveTabPassengerId(passenger.id)}
            >
              <span className={styles.tabInitial}>{passenger.name.charAt(0)}</span>
              <div className={styles.tabText}>
                <span className={styles.tabName}>{passenger.name}</span>
                <span className={styles.tabMealBadge}>
                  {assignedMeal.id === 'none' ? 'No meal' : `${assignedMeal.emoji} ${assignedMeal.badge}`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Guest's Meal Options Grid */}
      {currentPassenger && (
        <div className={styles.mealGrid}>
          {MEAL_OPTIONS.map((meal) => {
            const isChosen = currentPassenger.mealId === meal.id;

            return (
              <div
                key={meal.id}
                className={`${styles.mealCard} ${isChosen ? styles.mealCardChosen : ''}`}
                onClick={() => setMeal(currentPassenger.id, meal.id)}
                role="button"
                tabIndex={0}
                aria-pressed={isChosen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setMeal(currentPassenger.id, meal.id);
                  }
                }}
              >
                {/* Badges row */}
                <div className={styles.cardBadges}>
                  <span className={styles.dietaryBadge}>{meal.dietary}</span>
                  {meal.price === 0 && meal.id !== 'none' && (
                    <span className={styles.freeBadge}>FREE</span>
                  )}
                  {meal.price > 0 && (
                    <span className={styles.paidBadge}>₹{meal.price}</span>
                  )}
                </div>

                {/* Emoji / Illustration */}
                <div className={styles.emojiContainer}>{meal.emoji}</div>

                {/* Details */}
                <h3 className={styles.mealName}>{meal.label}</h3>
                <p className={styles.mealDesc}>{meal.description}</p>

                {/* Bottom select button */}
                <div className={styles.cardFooter}>
                  <button
                    type="button"
                    className={`${styles.selectBtn} ${isChosen ? styles.selectedBtn : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setMeal(currentPassenger.id, meal.id);
                    }}
                  >
                    {isChosen ? '✓ Selected' : meal.id === 'none' ? 'Select No Meal' : 'Add to Flight'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
