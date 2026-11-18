import { useState } from 'react';
import { useFlight } from '../../context/FlightContext';
import { SEAT_CATEGORIES, MEAL_OPTIONS } from '../../data/flightData';
import styles from './PassengerPanel.module.css';

export default function PassengerPanel() {
  const {
    state,
    activePassenger,
    setActivePassenger,
    removeSeat,
    setPassengerName,
    getSeatPrice,
  } = useFlight();

  return (
    <div className={styles.passengerPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.titleWrapper}>
          <div className={styles.titleIconBox}>👥</div>
          <div>
            <h2 className={styles.panelTitle}>Passenger Manifest</h2>
            <p className={styles.panelSubtitle}>
              Click a guest card to assign or change their aircraft seat
            </p>
          </div>
        </div>
      </div>

      <div className={styles.passengerList}>
        {state.passengers.map((passenger, index) => (
          <PassengerCard
            key={passenger.id}
            passenger={passenger}
            index={index}
            isActive={passenger.id === state.activePassengerId}
            onSelect={() => setActivePassenger(passenger.id)}
            onRemoveSeat={() => removeSeat(passenger.id)}
            onRename={(name) => setPassengerName(passenger.id, name)}
            getSeatPrice={getSeatPrice}
            layout={state.layout}
          />
        ))}
      </div>
    </div>
  );
}

function PassengerCard({
  passenger,
  index,
  isActive,
  onSelect,
  onRemoveSeat,
  onRename,
  getSeatPrice,
  layout,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(passenger.name);

  const seat = passenger.seatId ? layout.seats[passenger.seatId] : null;
  const seatPrice = passenger.seatId ? getSeatPrice(passenger.seatId) : 0;
  const category = seat ? SEAT_CATEGORIES[seat.category] : null;
  const meal = MEAL_OPTIONS.find((m) => m.id === passenger.mealId) || MEAL_OPTIONS[0];

  const handleSaveName = () => {
    const trimmed = nameValue.trim();
    if (trimmed) {
      onRename(trimmed);
    } else {
      setNameValue(passenger.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveName();
    if (e.key === 'Escape') {
      setNameValue(passenger.name);
      setIsEditing(false);
    }
  };

  const avatarGradients = [
    'linear-gradient(135deg, #2563eb, #1d4ed8)',
    'linear-gradient(135deg, #7c3aed, #6d28d9)',
    'linear-gradient(135deg, #059669, #047857)',
    'linear-gradient(135deg, #d97706, #b45309)',
    'linear-gradient(135deg, #db2777, #be185d)',
    'linear-gradient(135deg, #0891b2, #0e7490)',
  ];
  const avatarStyle = { background: avatarGradients[index % avatarGradients.length] };

  return (
    <div
      className={`${styles.passengerCard} ${isActive ? styles.cardActive : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onSelect();
      }}
      aria-label={`Select ${passenger.name}`}
    >
      {/* Active Selection Glow Ring */}
      {isActive && (
        <div className={styles.activePillBadge}>
          <span className={styles.pulseDot} />
          SELECTING SEAT
        </div>
      )}

      {/* Top Details (Avatar, Name, Edit) */}
      <div className={styles.cardTop}>
        <div className={styles.avatar} style={avatarStyle} aria-hidden="true">
          {passenger.name.charAt(0).toUpperCase()}
        </div>

        <div className={styles.nameBlock}>
          {isEditing ? (
            <input
              type="text"
              className={styles.nameInput}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              autoFocus
              maxLength={24}
              onClick={(e) => e.stopPropagation()}
              aria-label="Edit guest name"
            />
          ) : (
            <div className={styles.nameDisplayGroup}>
              <span className={styles.guestName}>{passenger.name}</span>
              <button
                type="button"
                className={styles.editNameBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                title="Edit name"
                aria-label="Edit name"
              >
                ✏️
              </button>
            </div>
          )}
          <span className={styles.guestNumber}>Passenger #{index + 1} · Adult</span>
        </div>
      </div>

      {/* Seat Assignment Info Box */}
      <div className={styles.assignmentBox}>
        {seat ? (
          <div className={styles.assignedContent}>
            <div
              className={styles.seatBadge}
              style={{ background: category.color }}
            >
              {passenger.seatId}
            </div>

            <div className={styles.seatMeta}>
              <span className={styles.categoryName}>{category.label}</span>
              <span className={styles.categoryPitch}>{seat.feature || category.pitch}</span>
            </div>

            <div className={styles.seatPriceCol}>
              <span className={styles.seatCost}>
                {seatPrice === 0 ? 'FREE' : `₹${seatPrice}`}
              </span>
              <button
                type="button"
                className={styles.unassignBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSeat();
                }}
                title="Remove seat assignment"
                aria-label={`Remove seat ${passenger.seatId}`}
              >
                ✕ Release
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.unassignedPrompt}>
            <span className={styles.promptIcon}>💺</span>
            <div className={styles.promptTextGroup}>
              <span className={styles.promptTitle}>
                {isActive ? 'Select a seat on map' : 'No seat selected'}
              </span>
              <span className={styles.promptSub}>
                {isActive ? 'Click any available seat' : 'Click card to assign'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Meal Selection Mini Badge */}
      {meal.id !== 'none' && (
        <div className={styles.mealPreviewBadge}>
          <span className={styles.mealIcon}>{meal.emoji}</span>
          <span className={styles.mealTitle}>{meal.label}</span>
          <span className={styles.mealCost}>
            {meal.price === 0 ? 'Free' : `+₹${meal.price}`}
          </span>
        </div>
      )}
    </div>
  );
}
