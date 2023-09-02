import React, { useState } from 'react';
import { animated, useSpring } from 'react-spring';
import '../Verifier.css';

function Verifier({ account, loading, subject, result, expiration, backStep, advanceStep, verified }) { 
    const fadeProps = useSpring({
        opacity: 1,
        from: { opacity: 0 },
    });

    const isVerified = () => {
        if (verified) {
            return "Verified";
        } else {
            return "Not Verified";
        }
    }

   
    return (
        <animated.div className="moduleWrapper" style={fadeProps}>
            <div className="interactionPanel">
                <h2 className="cardTitle">zPass Verification</h2>
                <div className="verifierContent">
                    <div>
                        <b> Verification Result: </b>
                        <span className="address">{isVerified()}</span>
                    </div>
                </div>
            </div>
            <br />
           
            <div className="navButtons">
                <button className="button" onClick={backStep}>Back</button>
                <button className="button" onClick={backStep} disabled>Done</button>
            </div>
        </animated.div>
    );
}

export default Verifier;
