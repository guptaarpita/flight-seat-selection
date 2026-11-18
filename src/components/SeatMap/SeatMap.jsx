import { useState } from 'react';
import { useFlight } from '../../context/FlightContext';
import { SEAT_CATEGORIES } from '../../data/flightData';
import styles from './SeatMap.module.css';

// ─── Individual Ergonomic Aircraft Seat ─────────────────────────
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
    state.categoryFilter !== 'all' &&
    seat.category !== state.categoryFilter &&
    !isSelectedActive &&
    !isSelectedOther;

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
        aria-label={`Seat ${seatId}, ${category.label}, ${
          isOccupied ? 'Occupied' : price === 0 ? 'Free' : `₹${price}`
        }`}
        aria-pressed={isSelectedActive}
      >
        {/* Leather Headrest with stitch */}
        <div className={styles.headrestWrapper}>
          <div className={styles.headrestCushion} />
        </div>

        {/* Armrest Left & Right */}
        <div className={styles.armrestLeft} />
        <div className={styles.armrestRight} />

        {/* Seat Cushion Core */}
        <div className={styles.seatCushion}>
          <span className={styles.seatLetter}>{seat.col}</span>

          {/* Indicators */}
          {isSelectedActive && <span className={styles.activeCheck}>✓</span>}

          {isSelectedOther && (
            <span className={styles.otherPill}>
              {otherPassenger ? otherPassenger.name.charAt(0) : '●'}
            </span>
          )}

          {isOccupied && <span className={styles.occupiedCross}>✕</span>}

          {isAvailable && (
            <span className={styles.seatPriceTag}>
              {price === 0 ? 'FREE' : `₹${price}`}
            </span>
          )}
        </div>
      </button>

      {/* Luxury Interactive Floating Tooltip */}
      {isHovered && (
        <div className={styles.tooltip} role="tooltip">
          <div className={styles.tooltipHeader}>
            <div className={styles.tooltipTitleGroup}>
              <span className={styles.tooltipSeatId}>SEAT {seatId}</span>
              <span className={styles.tooltipFeatureTag}>{seat.feature || 'Standard'}</span>
            </div>
            <span
              className={styles.tooltipCatBadge}
              style={{ background: category.bgColor, color: category.color, borderColor: category.borderColor }}
            >
              {category.shortLabel}
            </span>
          </div>

          <div className={styles.tooltipSpecs}>
            <span className={styles.pitchText}>📐 {category.pitch}</span>
            <span className={styles.reclineText}>💺 Ergonomic Cushion</span>
          </div>

          <div className={styles.tooltipFooter}>
            {isOccupied && (
              <div className={styles.statusOccupiedBox}>
                <span>🔒 Occupied by other guest</span>
              </div>
            )}
            {isSelectedActive && (
              <div className={styles.statusActiveBox}>
                <span>✓ Assigned to <strong>{activePassenger?.name}</strong></span>
                <span className={styles.tooltipClickHint}>Click to release seat</span>
              </div>
            )}
            {isSelectedOther && (
              <div className={styles.statusOtherBox}>
                <span>Assigned to <strong>{otherPassenger?.name}</strong></span>
              </div>
            )}
            {isAvailable && (
              <div className={styles.statusAvailableBox}>
                <span className={styles.fareLabel}>
                  Fare: <strong>{price === 0 ? 'COMPLIMENTARY' : `₹${price}`}</strong>
                </span>
                <span className={styles.tooltipClickHint}>
                  Assign to {activePassenger?.name} →
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Aisle with LED Pathway Lights ──────────────────────────────
function Aisle({ width = 'normal' }) {
  return (
    <div className={`${styles.aisle} ${styles[`aisle_${width}`]}`} aria-hidden="true">
      <div className={styles.aisleLedStripLeft} />
      <div className={styles.aisleCarpet} />
      <div className={styles.aisleLedStripRight} />
    </div>
  );
}

// ─── Airplane Window on Fuselage Wall ───────────────────────────
function CabinWindow({ side = 'left' }) {
  return (
    <div className={`${styles.cabinWindow} ${styles[`window_${side}`]}`} aria-hidden="true">
      <div className={styles.windowGlass} />
    </div>
  );
}

// ─── Main SeatMap with Realistic Airplane Fuselage & Wings ─────
export default function SeatMap() {
  const { state } = useFlight();
  const { layout } = state;
  const is232 = layout.id === '2-3-2';
  const rows = layout.rows;

  return (
    <div className={styles.aircraftStage}>
      {/* Outer Aircraft Fuselage Container */}
      <div className={styles.fuselageContainer}>
        {/* Left Wing (Rows 4–6) with RED Navigation Beacon */}
        <div className={styles.leftWingWrapper} aria-hidden="true">
          <div className={styles.wingStructure}>
            <div className={styles.jetEngine} />
            <div className={styles.wingFlapLines} />
            <div className={styles.redNavBeacon} title="Port Navigation Light (Red)" />
            <span className={styles.wingLabel}>LEFT WING</span>
          </div>
        </div>

        {/* Right Wing (Rows 4–6) with GREEN Navigation Beacon */}
        <div className={styles.rightWingWrapper} aria-hidden="true">
          <div className={styles.wingStructureRight}>
            <div className={styles.jetEngine} />
            <div className={styles.wingFlapLines} />
            <div className={styles.greenNavBeacon} title="Starboard Navigation Light (Green)" />
            <span className={styles.wingLabel}>RIGHT WING</span>
          </div>
        </div>

        {/* Aerodynamic Cockpit Nose */}
        <div className={styles.noseSection}>
          <div className={styles.noseRadome} />
          <div className={styles.cockpitCanopy}>
            <div className={styles.windshieldLeft} />
            <div className={styles.windshieldCenter} />
            <div className={styles.windshieldRight} />
          </div>
          <div className={styles.aircraftBadge}>
            <span className={styles.aircraftIcon}>✈</span>
            <span>{layout.aircraftType.toUpperCase()}</span>
          </div>
        </div>

        {/* Forward Bulkhead & Cabin Amenities */}
        <div className={styles.cabinBulkhead}>
          <div className={styles.amenityCard} title="Forward Lavatory">
            <span className={styles.amenityIcon}>🚻</span>
            <span className={styles.amenityText}>LAVATORY</span>
          </div>
          <div className={styles.cockpitDoorPill}>
            <span>COCKPIT BULKHEAD</span>
          </div>
          <div className={styles.amenityCard} title="Forward Galley Service">
            <span className={styles.amenityIcon}>☕</span>
            <span className={styles.amenityText}>GALLEY</span>
          </div>
        </div>

        {/* Column Header Letters */}
        <div className={styles.colHeaderRow}>
          <div className={styles.rowSpacer} />
          {!is232 ? (
            <>
              <div className={styles.seatCluster}>
                {layout.leftCols.map((c) => (
                  <div key={c} className={styles.headerLetter}>{c}</div>
                ))}
              </div>
              <Aisle />
              <div className={styles.seatCluster}>
                {layout.rightCols.map((c) => (
                  <div key={c} className={styles.headerLetter}>{c}</div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className={styles.seatCluster}>
                {layout.leftCols.map((c) => (
                  <div key={c} className={styles.headerLetter}>{c}</div>
                ))}
              </div>
              <Aisle width="narrow" />
              <div className={styles.seatCluster}>
                {layout.middleCols.map((c) => (
                  <div key={c} className={styles.headerLetter}>{c}</div>
                ))}
              </div>
              <Aisle width="narrow" />
              <div className={styles.seatCluster}>
                {layout.rightCols.map((c) => (
                  <div key={c} className={styles.headerLetter}>{c}</div>
                ))}
              </div>
            </>
          )}
          <div className={styles.rowSpacer} />
        </div>

        {/* Cabin Rows */}
        <div className={styles.cabinInterior}>
          {Array.from({ length: rows }, (_, idx) => idx + 1).map((rowNum) => {
            const isExitRow = layout.exitRows?.includes(rowNum);

            return (
              <div key={rowNum} className={styles.rowWrapper}>
                {/* Emergency Exit Row Header Banner */}
                {isExitRow && (
                  <div className={styles.emergencyExitBanner}>
                    <span className={styles.exitRunningMan}>🚪</span>
                    <span>EMERGENCY EXIT ROW · PRIORITY LEGROOM</span>
                    <span className={styles.exitRunningMan}>🚪</span>
                  </div>
                )}

                <div className={`${styles.seatRow} ${isExitRow ? styles.exitRowHighlight : ''}`}>
                  {/* Left Aircraft Oval Window */}
                  <CabinWindow side="left" />

                  {/* Left Emergency Door Marker */}
                  {isExitRow && (
                    <div className={`${styles.exitDoor} ${styles.exitDoorLeft}`} title="Emergency Exit Door" />
                  )}

                  {/* Row Number Pill */}
                  <div className={styles.rowNumberPill}>{rowNum}</div>

                  {!is232 ? (
                    <>
                      {/* Left Group: A, B, C */}
                      <div className={styles.seatCluster}>
                        {layout.leftCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>

                      {/* Aisle */}
                      <Aisle />

                      {/* Right Group: D, E */}
                      <div className={styles.seatCluster}>
                        {layout.rightCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Left: A, B */}
                      <div className={styles.seatCluster}>
                        {layout.leftCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>

                      <Aisle width="narrow" />

                      {/* Middle: D, E, F */}
                      <div className={styles.seatCluster}>
                        {layout.middleCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>

                      <Aisle width="narrow" />

                      {/* Right: G, H */}
                      <div className={styles.seatCluster}>
                        {layout.rightCols.map((col) => (
                          <Seat key={col} seatId={`${rowNum}${col}`} />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Right Emergency Door Marker */}
                  {isExitRow && (
                    <div className={`${styles.exitDoor} ${styles.exitDoorRight}`} title="Emergency Exit Door" />
                  )}

                  {/* Right Aircraft Oval Window */}
                  <CabinWindow side="right" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Aft / Rear Bulkhead & Tail Section */}
        <div className={styles.aftBulkhead}>
          <div className={styles.amenityCard} title="Aft Lavatory">
            <span className={styles.amenityIcon}>🚻</span>
            <span className={styles.amenityText}>LAVATORY</span>
          </div>
          <div className={styles.amenityCard} title="Aft Galley Service">
            <span className={styles.amenityIcon}>☕</span>
            <span className={styles.amenityText}>AFT GALLEY</span>
          </div>
        </div>

        {/* Aircraft Tail Cone Fin */}
        <div className={styles.aircraftTailCone}>
          <div className={styles.tailFin} />
        </div>
      </div>

      {/* Enhanced Legend Card */}
      <SeatLegend />
    </div>
  );
}

// ─── Seat Map Legend ───────────────────────────────────────────
function SeatLegend() {
  const { state } = useFlight();

  // Count available seats by category
  const counts = Object.values(state.layout.seats).reduce((acc, seat) => {
    if (!seat.occupied && !state.seatAssignments[`${seat.row}${seat.col}`]) {
      acc[seat.category] = (acc[seat.category] || 0) + 1;
    }
    return acc;
  }, {});

  return (
    <div className={styles.legendContainer} aria-label="Seat Map Legend">
      <div className={styles.legendHeader}>
        <div className={styles.legendTitle}>SEAT AVAILABILITY &amp; PRICING TIERS</div>
        <div className={styles.legendSub}>Select your preferred tier or click any seat above</div>
      </div>

      <div className={styles.legendGrid}>
        <div className={styles.legendItem}>
          <div className={`${styles.swatchSeat} ${styles.swatchFree}`}>
            <span className={styles.swatchLetter}>A</span>
          </div>
          <div className={styles.swatchText}>
            <div className={styles.swatchName}>
              <span>Standard (Free)</span>
              <span className={styles.countBadge}>{counts.free || 0} left</span>
            </div>
            <span className={styles.swatchCost}>₹0 · Complimentary</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <div className={`${styles.swatchSeat} ${styles.swatchStandard}`}>
            <span className={styles.swatchLetter}>B</span>
          </div>
          <div className={styles.swatchText}>
            <div className={styles.swatchName}>
              <span>Standard Preferred</span>
              <span className={styles.countBadge}>{counts.standard || 0} left</span>
            </div>
            <span className={styles.swatchCost}>₹150 · Preferred Zone</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <div className={`${styles.swatchSeat} ${styles.swatchExtraLegroom}`}>
            <span className={styles.swatchLetter}>C</span>
          </div>
          <div className={styles.swatchText}>
            <div className={styles.swatchName}>
              <span>Extra Legroom</span>
              <span className={styles.countBadge}>{counts.extraLegroom || 0} left</span>
            </div>
            <span className={styles.swatchCost}>₹350 · 35" Pitch</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <div className={`${styles.swatchSeat} ${styles.swatchPremium}`}>
            <span className={styles.swatchLetter}>D</span>
          </div>
          <div className={styles.swatchText}>
            <div className={styles.swatchName}>
              <span>Premium Front</span>
              <span className={styles.countBadge}>{counts.premium || 0} left</span>
            </div>
            <span className={styles.swatchCost}>₹250 · Priority Exit</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <div className={`${styles.swatchSeat} ${styles.swatchActive}`}>
            <span className={styles.swatchLetter}>✓</span>
          </div>
          <div className={styles.swatchText}>
            <span className={styles.swatchName}>Selected by You</span>
            <span className={styles.swatchCost}>Click again to release</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <div className={`${styles.swatchSeat} ${styles.swatchOther}`}>
            <span className={styles.swatchLetter}>P</span>
          </div>
          <div className={styles.swatchText}>
            <span className={styles.swatchName}>Party Member</span>
            <span className={styles.swatchCost}>Assigned to companion</span>
          </div>
        </div>

        <div className={styles.legendItem}>
          <div className={`${styles.swatchSeat} ${styles.swatchOccupied}`}>
            <span className={styles.swatchLetter}>✕</span>
          </div>
          <div className={styles.swatchText}>
            <span className={styles.swatchName}>Occupied</span>
            <span className={styles.swatchCost}>Unavailable for booking</span>
          </div>
        </div>
      </div>
    </div>
  );
}
