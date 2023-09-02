import { useEffect, useState } from "react";
import { useAleoWASM } from "./aleo-wasm-hook";
import Issuer from "./components/Issuer";
import Holder from "./components/Holder";
import Verifier from "./components/Verifier";
import {createWorkerFactory, useWorker} from '@shopify/react-web-worker';

const HELLO_PROGRAM = `
program helloworld.aleo;
function hello:
    input r0 as u32.public;
    input r1 as u32.private;
    assert.eq r0 r1;
    add r0 r1 into r2;
    output r2 as u32.private;
`;

const createVerifierWorker = createWorkerFactory(() => import('./workers/verifier'));

function App() {
    const aleo = useAleoWASM();

    const [state, setState] = useState({
        account: null,
        loading: false,
        subject: '',
        issuer: '',
        dob: '',
        expiration: '',
        signature: '',
        verified: false,
        step: 0,
        result: 0
    });

    const [worker, setWorker] = useState(null);
    const verifierWorker = useWorker(createVerifierWorker);

    const setIssuer = (issuerValue) => {
        setState(prev => ({ ...prev, issuer: issuerValue }));
    };

    const setSubject = (subjectValue) => { 
        setState(prev => ({ ...prev, subject: subjectValue }));
    };

    const setExpiration = (expirationValue) => {
        setState(prev => ({ ...prev, expiration: expirationValue }));
    };


    useEffect(() => {
        if (worker === null) {
            const spawnedWorker = spawnWorker();
            setWorker(spawnedWorker);
            return () => spawnedWorker.terminate();
        }
    }, []);

    const signString = (str) => {
        if (!str || !state.account) return;
        return state.account.sign(str);
    };

    const generateAccount = () => {
        setState(prev => ({ ...prev, account: new aleo.PrivateKey() }));
    };

    const generateSignature = () => {
        const str = `${state.subject}${state.issuer}${state.dob}${state.expiration}2023field21field`;
        const generatedSignature = signString(str);
        setState(prev => ({ ...prev, signature: generatedSignature.to_string() }));
    };

    const setIsIssued = () => {
        setState(prev => ({ ...prev, verified: true }));
    };

    const spawnWorker = () => new Worker(new URL("workers/worker.js", import.meta.url), { type: "module" });

    const postMessagePromise = (worker, message) => new Promise((resolve, reject) => {
        worker.onmessage = (event) => resolve(event.data);
        worker.onerror = (error) => reject(error);
        worker.postMessage(message);
    });

    const advanceStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
    const backStep = () => setState(prev => ({ ...prev, step: prev.step - 1 }));

    const execute = async () => {
        setState(prev => ({ ...prev, loading: true }));
        const response = await postMessagePromise(worker, {
            type: "ALEO_EXECUTE_PROGRAM_LOCAL",
            localProgram: HELLO_PROGRAM,
            aleoFunction: "hello",
            inputs: ["2u32", "2u32"],
            privateKey: state.account.to_string(),
        });
        const { outputs: {
            execution, verifyingKey
        } } = response;
        const webWorkerMessage = await verifierWorker.verify(execution, verifyingKey, HELLO_PROGRAM, 'hello');
        console.log('verification response:', webWorkerMessage)

        setState(prev => ({ ...prev, loading: false, result: response}));
        if (response === 10){
            setState(prev => ({ ...prev, verified: true }));
        } else {
            setState(prev => ({ ...prev, verified: false }));
        }
        advanceStep();
    };

    const initializeAndAdvance = () => {
        generateAccount();
        advanceStep();
    };

    const componentMap = {
        0: <div className="center"><button className="button" onClick={initializeAndAdvance}>Initialize zPass</button></div>,
        1: (
            <div className="flexContainer">
                <Issuer {...state} generateAccount={generateAccount} generateSignature={generateSignature} advanceStep={advanceStep} setIssuer={setIssuer} setExpiration={setExpiration} setSubject={setSubject}     setIsIssued={setIsIssued} />
                <Holder {...state} execute={execute} advanceStep={advanceStep} backStep={backStep} />
            </div>
        ),
        2: <Holder {...state} execute={execute} advanceStep={advanceStep} backStep={backStep} />,
        3: <Verifier {...state} execute={execute} advanceStep={advanceStep} backStep={backStep} />
    };

    return (
        <div className="container">
            <h1 className="centered-title">zPass Flow</h1>
            {componentMap[state.step] || <div>Completed</div>}
        </div>
    );
}

export default App;
