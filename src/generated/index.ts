import { PublicKey } from "@solana/web3.js";
export * from "./accounts";
export * from "./errors";
export * from "./instructions";
export * from "./types";

/**
 * Program address
 *
 * @category constants
 * @category generated
 */
export const PROGRAM_ADDRESS = "84zHEoSwTo6pb259RtmeYQ5KNStik8pib815q7reZjdx";

/**
 * Program public key
 *
 * @category constants
 * @category generated
 */
export const PROGRAM_ID = new PublicKey(PROGRAM_ADDRESS);
