import React from 'react';
import '../Issuer.css';  // Make sure you have defined styles in this CSS file

const CredentialDetail = ({ label, value }) => (
    <div className="credentialDetail my-2 px-4 py-2 rounded-lg bg-gray-100 flex justify-between">
        <span className="label font-semibold">{label}:</span>
        <span className="value text-sm">{value}</span>
    </div>
);

const credentialData = {
    subject: "Aleo Fan",
    issuer: "zPass",
    expiration: "01/01/2030"
};

const Issuer = ({ advanceStep, setIssuer, setSubject, setExpiration, setIsIssued }) => {
    const handleIssue = () => {
        setIssuer(credentialData.issuer);
        setSubject(credentialData.subject);
        setExpiration(credentialData.expiration);
        setIsIssued();  // Set the verified state to true
        advanceStep();
    };

    return (
        <div className="moduleWrapper p-10 bg-gray-200">
            <div className="cardHeader text-2xl font-semibold mb-6">zPass Credential Issuer</div>
            
            <div className="credentialDetails space-y-4">
                <CredentialDetail label="Subject" value={credentialData.subject} />
                <CredentialDetail label="Issuer" value={credentialData.issuer} />
                <CredentialDetail label="Expiration" value={credentialData.expiration} />
            </div>
            
            <div className="actionButtonWrapper mt-6">
                <button className="button w-full bg-blue-500 text-white p-2 rounded-lg" onClick={handleIssue}>
                    Issue zPass
                </button>
            </div>
        </div>
    );
};

export default Issuer;
