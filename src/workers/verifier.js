import { verifyFunctionExecution, initializeWasm, VerifyingKey, AleoKeyProvider, ProgramManager } from "@aleohq/sdk";
import { Execution } from "@aleohq/wasm"

await initializeWasm();

const defaultHost = "https://vm.aleo.org/api";
const keyProvider = new AleoKeyProvider();
const programManager = new ProgramManager(
  defaultHost,
  keyProvider,
  undefined,
);

keyProvider.useCache(true);

export function verify(executionString, verifyingKeyString, program, functionName) {
    const verifyingKey = VerifyingKey.fromString(verifyingKeyString);
    const isCorrect = verifyFunctionExecution(
        Execution.fromString(executionString), 
        verifyingKey,
        programManager.createProgramFromSource(program), 
        functionName
    );
    console.log("Execution verified successfully: " + isCorrect);
    return isCorrect;
}