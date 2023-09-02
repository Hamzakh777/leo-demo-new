import React, { useState, useEffect } from 'react';
import { animated, useSpring } from 'react-spring';
import '../Holder.css';

const AddressDisplay = ({ label, value }) => (
    <div className="addressWrapper my-2 px-4 py-2 rounded-lg bg-gray-100">
        <div>
            <b>{label}:</b><br />
            <span className="address text-sm">{value}</span>
        </div>
    </div>
);

const Holder = ({ loading, expiration, execute, advanceStep, backStep, issuer, subject, verified }) => {
    const fadeProps = useSpring({ opacity: 1, from: { opacity: 0 } });
    const [hasExecuted, setHasExecuted] = useState(false);
    const [error, setError] = useState(null);
    const [showVerifyButton, setShowVerifyButton] = useState(true);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (issuer && subject && expiration && !hasExecuted && verified) {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000); // Notification disappears after 5 seconds
        }
    }, [issuer, subject, expiration, hasExecuted, verified]);
    

    const handleExecute = async () => {
        if (!verified) {
            setError("Credentials not issued yet.");
            return;
        }

        try {
            await execute();
            setHasExecuted(true);
        } catch (err) {
            console.error("Error executing:", err);
            setError("An error occurred while generating the proof.");
        }
    };

    const handleVerifyClick = () => {
        setShowVerifyButton(false);
    }

    const isButtonDisabled = loading || !subject || !expiration;

    return (
        <div className="moduleWrapper p-10 bg-gray-200">
            {showNotification && <div className="notification bg-green-500 text-white p-2 rounded-lg mb-4">zPass received!</div>}
            <div className="interactionPanel bg-white shadow-md p-6 rounded-lg">
                <h2 className="text-2xl font-semibold mb-6">zPass</h2>
                {error && <div className="error text-red-500 mb-4">{error}</div>}
                
                {showVerifyButton ? (
                    <button 
                        className="button w-full bg-blue-500 text-white p-2 rounded-lg"
                        onClick={handleVerifyClick} 
                        aria-label="Verify with zPass"
                    >
                        Verify with zPass
                    </button>
                ) : (
                    <animated.div style={fadeProps} className="space-y-4">
                        <AddressDisplay label="Issuer" value={issuer} />
                        <AddressDisplay label="Subject" value={subject} />
                        <AddressDisplay label="Expiration" value={expiration} />
                        <button 
                            className="button w-full bg-green-500 text-white p-2 rounded-lg"
                            onClick={handleExecute} 
                            aria-label="Generate Proof"
                            disabled={isButtonDisabled}
                        >
                            {loading ? 'Generating...' : 'Generate Proof'}
                        </button>
                    </animated.div>
                )}
            </div>
            
            <div className="navButtons mt-6 flex justify-between">
                <button className="button bg-gray-500 text-white p-2 rounded-lg" onClick={backStep}>Back</button>
                <button className="button bg-gray-700 text-white p-2 rounded-lg" onClick={advanceStep} disabled={!hasExecuted}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default Holder;
