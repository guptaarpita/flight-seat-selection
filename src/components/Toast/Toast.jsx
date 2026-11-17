import { useFlight } from '../../context/FlightContext';
import styles from './Toast.module.css';

export default function Toast() {
  const { toasts, removeToast } = useFlight();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <span className={styles.icon}>
            {toast.type === 'success' && '✓'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'error' && '✕'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.closeBtn}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
