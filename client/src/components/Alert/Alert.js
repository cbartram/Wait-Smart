import React from "react";
import './Alert.css';

/**
 * Shows an alert to the user at the top of the page
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
function Alert(props) {
    /**
     * Renders the correct icon depending on the
     * type of alert passed in as props
     */
    function renderIconType() {
        switch(props.type.toUpperCase()) {
            case 'SUCCESS':
                return <span className="fa fa-check success-icon" />;
            case 'DANGER':
                return <span className="fa fa-times danger-icon" />;
            case 'WARNING':
                return <span className="fas fa-exclamation warning-icon" />;
            case 'INFO':
                return <span className="fas fa-info info-icon" />;
            default:
                return <span className="fas fa-info info-icon" />;
        }
    }

    return (
        <div className={`flash flash-${props.type.toLowerCase() || 'info'} flash-full flash-notice`}>
            { renderIconType() }
            <div className="px-2">
                <button className="flash-close" type="button" aria-label="Dismiss this message" onClick={() => props.onDismiss(props.id)}>
                    <svg color="red" className="flash-octicon octicon-x" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                        <path fillRule="evenodd" d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                    </svg>
                </button>
                { props.message || 'Alert' }
            </div>
        </div>
    )
}

export default Alert;