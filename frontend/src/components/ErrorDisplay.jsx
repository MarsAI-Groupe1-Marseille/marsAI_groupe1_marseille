import { useError } from '../context/ErrorContext';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import '../styles/ErrorDisplay.css';

/**
 * Composant global pour afficher les erreurs et messages
 */
export default function ErrorDisplay() {
    const { errors, removeError } = useError();

    if (errors.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'error':
                return <AlertCircle size={20} />;
            case 'warning':
                return <AlertTriangle size={20} />;
            case 'success':
                return <CheckCircle size={20} />;
            case 'info':
                return <Info size={20} />;
            default:
                return <AlertCircle size={20} />;
        }
    };

    return (
        <div className="error-display-container">
            {errors.map((error) => (
                <div
                    key={error.id}
                    className={`error-alert error-alert-${error.type}`}
                    role="alert"
                >
                    <div className="error-alert-content">
                        <div className="error-alert-icon">
                            {getIcon(error.type)}
                        </div>
                        <div className="error-alert-message">
                            {error.message}
                        </div>
                    </div>
                    <button
                        className="error-alert-close"
                        onClick={() => removeError(error.id)}
                        aria-label="Fermer"
                    >
                        <X size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
}
