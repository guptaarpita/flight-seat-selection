import { useState } from 'react';
import { useFlight } from '../../context/FlightContext';
import { SEAT_CATEGORIES } from '../../data/flightData';
import styles from './SeatMap.module.css';

// ─── Individual Seat Component ─────────────────────────────────
function Seat({ seatId }) {
  const {
    state,
    getSeatState,
    getSeatPrice,
    assignSeat,
    activePassenger,
  } = useFlight();

  const [isHovered, setIsHovered] = useState(false);

  const seat = state.layout.seats[seatId];
  if (!seat) return null;

  const seatState = getSeatState(seatId);
  const price = getSeatPrice(seatId);
  const category = SEAT_CATEGORIES[seat.category];

  const isOccupied = seatState === 'occupied';
  const isSelectedActive = seatState === 'selected-active';
  const isSelectedOther = seatState === 'selected-other';
  const isAvailable = seatState === 'available';

  const otherPassenger = isSelectedOther
    ? state.passengers.find((p) => p.seatId === seatId)
    : null;

  const handleClick = () => {
    assignSeat(seatId);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Highlighting logic for category filter
  const isFilterDimmed =
    state.categoryFilter !== 'all' && seat.category !== state.categoryFilter && !isSelectedActive && !isSelectedOther;

  return (
    <div
      className={styles.seatContainer}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        className={[
          styles.seat,
          styles[seatState.replace('-', '_')],
          styles[`cat_${seat.category}`],
          isFilterDimmed ? styles.dimmed : '',
        ].join(' ')}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={isOccupied || isSelectedOther}
        aria-label={`Seat ${seatId}, ${category.label}, ${isOccupied ? 'Occupied' : price === 0 ? 'Free' : `₹${price}`}`}
        aria-pressed={isSelectedActive}
      >
        {/* Headrest line */}
        <div className={styles.headrest} />

        {/* Seat content */}
        <span className={styles.colLetter}>{seat.col}</span>

        {/* Indicator badges */}
        {isSelectedActive && (
          <span className={styles.activeCheck}>✓</span>
        )}

        {isSelectedOther && (
          <span className={styles.otherInitials}>
            {otherPassenger ? otherPassenger.name.charAt(0) : '●'}
          </span>
        )}

        {isOccupied && (
          <span className={styles.occupiedCross}>✕</span>
        )}

        {isAvailable && (
          <span className={styles.priceTag}>
            {price === 0 ? 'FREE' : `₹${price}`}
          </span>
        )}
      </button>

      {/* Interactive Rich Tooltip */}
      {isHovered && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.tooltipHeader}>
            <span className={styles.tooltipSeatId}>{seatId}</span>
            <span
              className={styles.tooltipBadge}
              style={{ background: category.bgColor, color: category.color }}
            >
              {category.shortLabel}
            </span>
          </div>

          <div className={styles.tooltipFeature}>
            {seat.feature || 'Standard Seat'} · {category.pitch}
          </div>

          <div className={styles.tooltipStatus}>
            {isOccupied && (
              <span className={styles.statusOccupied}>🔒 Occupied</span>
            )}
            {isSelectedActive && (
              <span className={styles.statusActive}>
                ✓ Assigned to {activePassenger?.name} (Click to remove)
              </span>
            )}
            {isSelectedOther && (
              <span className={styles.statusOther}>
                Assigned to {otherPassenger?.name}
              </span>
            )}
            {isAvailable && (
              <span className={styles.statusAvailable}>
                Price: <strong>{price === 0 ? 'FREE' : `₹${price}`}</strong> (Click to assign)
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Aisle Component ───────────────────────────────────────────
function Aisle({ width = 'normal' }) {
  return (
    <div className={`${styles.aisle} ${styles[`aisle_${width}`]}`} aria-hidden="true">
      <div className={styles.aisleCarpet} />
    </div>
  );
}

// ─── SeatMap Main Component ────────────────────────────────────
export default function SeatMap() {
  const { state } = useFlight();
  const { layout } = state;
  const is232 = layout.id === '2-3-2';
  const rows = layout.rows;

  return (
    <div className={styles.fuselageWrapper}>
      {/* Outer Aircraft Fuselage */}
      <div className={styles.fuselage}>
        {/* Cockpit / Airplane Nose */}
        <div className={styles.cockpit}>
          <div className={styles.noseCap} />
          <div className={styles.windshield}>
            <div className={styles.windowLeft} />
            <div className={styles.windowCenter} />
            <div className={styles.windowRight} />
          </div>
          <div className={styles.cockpitLabel}>
            COCKPIT · {layout.aircraftType.toUpperCase()}
          </div>
        </div>

        {/* Front Bulkhead (Galley & Restrooms) */}
        <div className={styles.frontBulkhead}>
          <div className={styles.facilityPill} title="Forward Lavatory">
            <span>🚻</span> WC
          </div>
          <div className={styles.curtainDivider} />
          <div className={styles.facilityPill} title="Forward Galley">
            <span>☕</span> Galley
          </div>
        </div>

        {/* Column Header Letters */}
        <div className={styles.colHeaderRow}>
          <div className={styles.rowNumberCol} />
          {!is232 ? (
            <>
              <div className={styles.seatGroup}>
                {layout.leftCols.map((c) => (
                  <div key={c} className={styles.colHeaderCell}>{c}</div>
                ))}
              </div>
              <Aisle />
              <div className={styles.seatGroup}>
                {layout.rightCols.map((c) => (
                  <div key={c} className={styles.colHeaderCell}>{c}</div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={styles.seatGroup}>
                {layout.leftCols.map((c) => (
                  <div key={c} className={styles.colHeaderCell}>{c}</div>
                ))}
              </div>
              <Aisle width="narrow" />
              <div className={styles.seatGroup}>
                {layout.middleCols.map((c) => (
                  <div key={c} className={styles.colHeaderCell}>{c}</div>
                ))}
              </div>
              <Aisle width="narrow" />
              <div className={styles.seatGroup}>
                {layout.rightCols.map((c) => (
                  <div key={c} className={styles.colHeaderCell}>{c}</div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cabin Seating Grid */}
        <div className={styles.cabinGrid}>
          {Array.from({ length: rows }, (_, idx) => idx + 1).map((rowNum) => {
            const isExitRow = layout.exitRows?.includes(rowNum);

            return (
              <div key={rowNum} className={styles.rowContainer}>
                {/* Emergency exit row indicator if applicable */}
                {isExitRow && (
                  <div className={styles.exitRowBanner}>
                    <span className={styles.exitIcon}>🚪</span>
                    <span>EMERGENCY EXIT ROW · EXTRA LEGROOM</span>
                    <span className={styles.exitIcon}>🚪</span>
                  </div>
                )}

                <div className={`${styles.seatRow} ${isExitRow ? styles.exitRowHighlight : ''}`}>
                  {/* Left Emergency Exit Door tab */}
                  {isExitRow && <div className={`${styles.exitDoorTab} ${styles.exitLeft}`} title="Emergency Exit Door" />}

                  {/* Row Number */}
                  <div className={styles.rowNumberCol}>{rowNum}</div>

                  {!is232 ? (
                    <>
                      {/* Left 3 seats: A, B, C */}
                      <div className={styles.seatGroup}>
                        {layout.leftCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>

                      {/* Center Aisle */}
                      <Aisle />

                      {/* Right 2 seats: D, E */}
                      <div className={styles.seatGroup}>
                        {layout.rightCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left 2 seats: A, B */}
                      <div className={styles.seatGroup}>
                        {layout.leftCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>

                      {/* Left Aisle */}
                      <Aisle width="narrow" />

                      {/* Middle 3 seats: D, E, F */}
                      <div className={styles.seatGroup}>
                        {layout.middleCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>

                      {/* Right Aisle */}
                      <Aisle width="narrow" />

                      {/* Right 2 seats: G, H */}
                      <div className={styles.seatGroup}>
                        {layout.rightCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Right Emergency Exit Door tab */}
                  {isExitRow && <div className={`${styles.exitDoorTab} ${styles.exitRight}`} title="Emergency Exit Door" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rear Bulkhead & Tail */}
        <div className={styles.rearBulkhead}>
          <div className={styles.facilityPill} title="Aft Lavatory">
            <span>🚻</span> WC
          </div>
          <div className={styles.curtainDivider} />
          <div className={styles.facilityPill} title="Aft Galley">
            <span>☕</span> Galley
          </div>
        </div>

        <div className={styles.planeTail} />
      </div>

      {/* Visual Legend */}
      <SeatLegend />
    </div>
  );
}

// ─── Seat Legend ───────────────────────────────────────────────
function SeatLegend() {
  return (
    <div className={styles.legendContainer} aria-label="Seat Map Legend">
      <h3 className={styles.legendHeading}>Seat Legend &amp; Availability</h3>
      <div className={styles.legendGrid}>
        <div className={styles.legendCard}>
          <div className={`${styles.swatch} ${styles.swatchFree}`} />
          <div className={styles.swatchInfo}>
            <span className={styles.swatchTitle}>Standard (Free)</span>
            <span className={styles.swatchPrice}>₹0 Complimentary</span>
          </div>
        </div>

        <div className={styles.legendCard}>
          <div className={`${styles.swatch} ${styles.swatchStandard}`} />
          <div className={styles.swatchInfo}>
            <span className={styles.swatchTitle}>Standard Preferred</span>
            <span className={styles.swatchPrice}>₹150</span>
          </div>
        </div>

        <div className={styles.legendCard}>
          <div className={`${styles.swatch} ${styles.swatchExtraLegroom}`} />
          <div className={styles.swatchInfo}>
            <span className={styles.swatchTitle}>Extra Legroom</span>
            <span className={styles.swatchPrice}>₹350</span>
          </div>
        </div>

        <div className={styles.legendCard}>
          <div className={`${styles.swatch} ${styles.swatchPremium}`} />
          <div className={styles.swatchInfo}>
            <span className={styles.swatchTitle}>Premium Front</span>
            <span className={styles.swatchPrice}>₹250</span>
          </div>
        </div>

        <div className={styles.legendCard}>
          <div className={`${styles.swatch} ${styles.swatchActive}`} />
          <div className={styles.swatchInfo}>
            <span className={styles.swatchTitle}>Selected by You</span>
            <span className={styles.swatchPrice}>Click to unassign</span>
          </div>
        </div>

        <div className={styles.legendCard}>
          <div className={`${styles.swatch} ${styles.swatchOther}`} />
          <div className={styles.swatchInfo}>
            <span className={styles.swatchTitle}>Other Passenger</span>
            <span className={styles.swatchPrice}>Reserved in party</span>
          </div>
        </div>

        <div className={styles.legendCard}>
          <div className={`${styles.swatch} ${styles.swatchOccupied}`} />
          <div className={styles.swatchInfo}>
            <span className={styles.swatchTitle}>Occupied</span>
            <span className={styles.swatchPrice}>Not selectable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
