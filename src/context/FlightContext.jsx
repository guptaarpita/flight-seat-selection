import { createContext, useContext, useReducer, useCallback, useState } from 'react';
import {
  LAYOUT_3_2,
  ALL_LAYOUTS,
  DEFAULT_PASSENGER_NAMES,
  SEAT_CATEGORIES,
  MEAL_OPTIONS,
  MAX_PASSENGERS,
} from '../data/flightData';

// ─── Initial State ─────────────────────────────────────────────
function createPassenger(index) {
  return {
    id: `p${index}`,
    name: DEFAULT_PASSENGER_NAMES[index] || `Passenger ${index + 1}`,
    seatId: null,
    mealId: 'none',
  };
}

const initialState = {
  layout: LAYOUT_3_2,
  passengerCount: 1,
  passengers: [createPassenger(0)],
  activePassengerId: 'p0',
  seatAssignments: {}, // { [seatId]: passengerId }
  categoryFilter: 'all', // 'all' | 'free' | 'standard' | 'extraLegroom' | 'premium'
  couponCode: '',
  discountAmount: 0,
};

// ─── Reducer ───────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'SET_LAYOUT': {
      // Clear seat assignments when changing configuration to avoid invalid seat mappings
      const clearedPassengers = state.passengers.map((p) => ({ ...p, seatId: null }));
      return {
        ...state,
        layout: action.layout,
        passengers: clearedPassengers,
        seatAssignments: {},
      };
    }

    case 'SET_PASSENGER_COUNT': {
      const count = Math.max(1, Math.min(action.count, MAX_PASSENGERS));
      const currentPassengers = state.passengers.slice(0, count);

      for (let i = currentPassengers.length; i < count; i++) {
        currentPassengers.push(createPassenger(i));
      }

      // Cleanup seat assignments for any removed passengers
      const activeIds = currentPassengers.map((p) => p.id);
      const newAssignments = { ...state.seatAssignments };
      Object.entries(newAssignments).forEach(([seatId, pId]) => {
        if (!activeIds.includes(pId)) {
          delete newAssignments[seatId];
        }
      });

      const activeId = activeIds.includes(state.activePassengerId)
        ? state.activePassengerId
        : currentPassengers[0].id;

      return {
        ...state,
        passengerCount: count,
        passengers: currentPassengers,
        activePassengerId: activeId,
        seatAssignments: newAssignments,
      };
    }

    case 'SET_ACTIVE_PASSENGER':
      return { ...state, activePassengerId: action.passengerId };

    case 'ASSIGN_SEAT': {
      const { seatId } = action;
      const seat = state.layout.seats[seatId];
      if (!seat || seat.occupied) return state;

      const activePassenger = state.passengers.find((p) => p.id === state.activePassengerId);
      if (!activePassenger) return state;

      // Prevent stealing another passenger's seat directly
      const currentOwner = state.seatAssignments[seatId];
      if (currentOwner && currentOwner !== activePassenger.id) return state;

      const newAssignments = { ...state.seatAssignments };
      const updatedPassengers = state.passengers.map((p) => ({ ...p }));

      // If active passenger already has a seat, release it first
      if (activePassenger.seatId) {
        delete newAssignments[activePassenger.seatId];
      }

      // If clicking the seat they already occupy -> Deselect / Remove
      let nextActiveId = state.activePassengerId;
      if (activePassenger.seatId === seatId) {
        updatedPassengers.find((p) => p.id === activePassenger.id).seatId = null;
        delete newAssignments[seatId];
      } else {
        // Assign the new seat
        newAssignments[seatId] = activePassenger.id;
        updatedPassengers.find((p) => p.id === activePassenger.id).seatId = seatId;

        // Auto-advance: if there are other unassigned passengers, pick the next one!
        const nextUnassigned = updatedPassengers.find((p) => !p.seatId && p.id !== activePassenger.id);
        if (nextUnassigned) {
          nextActiveId = nextUnassigned.id;
        }
      }

      return {
        ...state,
        passengers: updatedPassengers,
        seatAssignments: newAssignments,
        activePassengerId: nextActiveId,
      };
    }

    case 'REMOVE_SEAT': {
      const { passengerId } = action;
      const passenger = state.passengers.find((p) => p.id === passengerId);
      if (!passenger || !passenger.seatId) return state;

      const newAssignments = { ...state.seatAssignments };
      delete newAssignments[passenger.seatId];

      const updatedPassengers = state.passengers.map((p) =>
        p.id === passengerId ? { ...p, seatId: null } : p
      );

      return {
        ...state,
        passengers: updatedPassengers,
        seatAssignments: newAssignments,
        activePassengerId: passengerId,
      };
    }

    case 'CLEAR_ALL_SEATS': {
      const clearedPassengers = state.passengers.map((p) => ({ ...p, seatId: null }));
      return {
        ...state,
        passengers: clearedPassengers,
        seatAssignments: {},
      };
    }

    case 'AUTO_ASSIGN_ALL': {
      // Find available unoccupied and unassigned seats
      const availableSeatIds = Object.keys(state.layout.seats).filter((id) => {
        const s = state.layout.seats[id];
        return !s.occupied && !state.seatAssignments[id];
      });

      const newAssignments = { ...state.seatAssignments };
      const updatedPassengers = state.passengers.map((p) => ({ ...p }));

      updatedPassengers.forEach((p) => {
        if (!p.seatId && availableSeatIds.length > 0) {
          const assignedId = availableSeatIds.shift();
          newAssignments[assignedId] = p.id;
          p.seatId = assignedId;
        }
      });

      return {
        ...state,
        passengers: updatedPassengers,
        seatAssignments: newAssignments,
      };
    }

    case 'SET_MEAL': {
      const { passengerId, mealId } = action;
      const updatedPassengers = state.passengers.map((p) =>
        p.id === passengerId ? { ...p, mealId } : p
      );
      return { ...state, passengers: updatedPassengers };
    }

    case 'SET_PASSENGER_NAME': {
      const { passengerId, name } = action;
      const updatedPassengers = state.passengers.map((p) =>
        p.id === passengerId ? { ...p, name } : p
      );
      return { ...state, passengers: updatedPassengers };
    }

    case 'SET_CATEGORY_FILTER':
      return { ...state, categoryFilter: action.filter };

    case 'APPLY_COUPON': {
      return {
        ...state,
        couponCode: action.code,
        discountAmount: action.discount,
      };
    }

    case 'REMOVE_COUPON':
      return { ...state, couponCode: '', discountAmount: 0 };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────
const FlightContext = createContext(null);

export function FlightProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toasts, setToasts] = useState([]);
  const [isBoardingModalOpen, setIsBoardingModalOpen] = useState(false);

  // Toast notification helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Actions
  const setLayout = useCallback(
    (layout) => {
      if (layout.id !== state.layout.id) {
        dispatch({ type: 'SET_LAYOUT', layout });
        showToast(`Switched to ${layout.label}. Seat assignments reset.`, 'info');
      }
    },
    [state.layout.id, showToast]
  );

  const setPassengerCount = useCallback(
    (count) => {
      dispatch({ type: 'SET_PASSENGER_COUNT', count });
      showToast(`Passenger count set to ${count}`, 'info');
    },
    [showToast]
  );

  const setActivePassenger = useCallback((passengerId) => {
    dispatch({ type: 'SET_ACTIVE_PASSENGER', passengerId });
  }, []);

  const assignSeat = useCallback(
    (seatId) => {
      const seat = state.layout.seats[seatId];
      if (!seat) return;

      if (seat.occupied) {
        showToast(`Seat ${seatId} is already occupied by another flight guest.`, 'error');
        return;
      }

      const active = state.passengers.find((p) => p.id === state.activePassengerId);
      const currentOwnerId = state.seatAssignments[seatId];

      if (currentOwnerId && currentOwnerId !== state.activePassengerId) {
        const owner = state.passengers.find((p) => p.id === currentOwnerId);
        showToast(
          `Seat ${seatId} is already assigned to ${owner ? owner.name : 'another passenger'}.`,
          'warning'
        );
        return;
      }

      if (active && active.seatId === seatId) {
        dispatch({ type: 'ASSIGN_SEAT', seatId });
        showToast(`Removed seat ${seatId} for ${active.name}.`, 'info');
        return;
      }

      dispatch({ type: 'ASSIGN_SEAT', seatId });
      showToast(`Assigned seat ${seatId} to ${active ? active.name : 'passenger'}.`, 'success');
    },
    [state.layout.seats, state.passengers, state.activePassengerId, state.seatAssignments, showToast]
  );

  const removeSeat = useCallback(
    (passengerId) => {
      const p = state.passengers.find((item) => item.id === passengerId);
      if (p && p.seatId) {
        dispatch({ type: 'REMOVE_SEAT', passengerId });
        showToast(`Removed seat ${p.seatId} from ${p.name}.`, 'info');
      }
    },
    [state.passengers, showToast]
  );

  const clearAllSeats = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_SEATS' });
    showToast('All seat assignments have been cleared.', 'info');
  }, [showToast]);

  const autoAssignAll = useCallback(() => {
    dispatch({ type: 'AUTO_ASSIGN_ALL' });
    showToast('Smart auto-assigned seats for all passengers!', 'success');
  }, [showToast]);

  const setMeal = useCallback(
    (passengerId, mealId) => {
      dispatch({ type: 'SET_MEAL', passengerId, mealId });
      const meal = MEAL_OPTIONS.find((m) => m.id === mealId);
      const p = state.passengers.find((item) => item.id === passengerId);
      if (meal && p) {
        showToast(`Updated meal for ${p.name}: ${meal.label}`, 'success');
      }
    },
    [state.passengers, showToast]
  );

  const setPassengerName = useCallback(
    (passengerId, name) => {
      dispatch({ type: 'SET_PASSENGER_NAME', passengerId, name });
    },
    []
  );

  const setCategoryFilter = useCallback((filter) => {
    dispatch({ type: 'SET_CATEGORY_FILTER', filter });
  }, []);

  const applyCoupon = useCallback(
    (code) => {
      const trimmed = code.trim().toUpperCase();
      if (trimmed === 'FLYHIGH') {
        dispatch({ type: 'APPLY_COUPON', code: 'FLYHIGH', discount: 150 });
        showToast('Coupon FLYHIGH applied! ₹150 discount added.', 'success');
        return { success: true, message: '₹150 off with FLYHIGH' };
      } else if (trimmed === 'SKYFIRST') {
        dispatch({ type: 'APPLY_COUPON', code: 'SKYFIRST', discount: 100 });
        showToast('Coupon SKYFIRST applied! ₹100 discount added.', 'success');
        return { success: true, message: '₹100 off with SKYFIRST' };
      } else {
        showToast('Invalid coupon code. Try FLYHIGH or SKYFIRST.', 'error');
        return { success: false, message: 'Invalid coupon' };
      }
    },
    [showToast]
  );

  const removeCoupon = useCallback(() => {
    dispatch({ type: 'REMOVE_COUPON' });
    showToast('Coupon removed.', 'info');
  }, [showToast]);

  // ─── Selectors ───────────────────────────────────────────────
  const getSeatState = useCallback(
    (seatId) => {
      const seat = state.layout.seats[seatId];
      if (!seat) return 'unknown';
      if (seat.occupied) return 'occupied';
      const ownerId = state.seatAssignments[seatId];
      if (ownerId) {
        return ownerId === state.activePassengerId ? 'selected-active' : 'selected-other';
      }
      return 'available';
    },
    [state.layout.seats, state.seatAssignments, state.activePassengerId]
  );

  const getSeatPrice = useCallback(
    (seatId) => {
      const seat = state.layout.seats[seatId];
      if (!seat) return 0;
      return SEAT_CATEGORIES[seat.category]?.price ?? 0;
    },
    [state.layout.seats]
  );

  const totalSeatCost = state.passengers.reduce((sum, p) => {
    if (!p.seatId) return sum;
    return sum + getSeatPrice(p.seatId);
  }, 0);

  const totalMealCost = state.passengers.reduce((sum, p) => {
    if (!p.mealId || p.mealId === 'none') return sum;
    const meal = MEAL_OPTIONS.find((m) => m.id === p.mealId);
    return sum + (meal?.price ?? 0);
  }, 0);

  const subtotalCost = totalSeatCost + totalMealCost;
  const gstTax = Math.round(subtotalCost * 0.05); // 5% GST on ancillary services
  const grandTotal = Math.max(0, subtotalCost + gstTax - state.discountAmount);

  const activePassenger = state.passengers.find((p) => p.id === state.activePassengerId);
  const unassignedPassengers = state.passengers.filter((p) => !p.seatId);

  return (
    <FlightContext.Provider
      value={{
        state,
        activePassenger,
        unassignedPassengers,
        toasts,
        isBoardingModalOpen,
        setIsBoardingModalOpen,
        showToast,
        removeToast,
        setLayout,
        setPassengerCount,
        setActivePassenger,
        assignSeat,
        removeSeat,
        clearAllSeats,
        autoAssignAll,
        setMeal,
        setPassengerName,
        setCategoryFilter,
        applyCoupon,
        removeCoupon,
        getSeatState,
        getSeatPrice,
        totalSeatCost,
        totalMealCost,
        subtotalCost,
        gstTax,
        grandTotal,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
}

export function useFlight() {
  const ctx = useContext(FlightContext);
  if (!ctx) throw new Error('useFlight must be used within a FlightProvider');
  return ctx;
}
