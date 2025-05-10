import { useMemo } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { AnchorProvider, IdlAccounts } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import type { CompanyRegistration } from "./idl";
import idl from "./idl.json";

import { Buffer } from "buffer";
window.Buffer = window.Buffer || Buffer;

export function useCompanyProgram(){
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(() => {
    if (!wallet || !wallet.publicKey) return null;
    return new AnchorProvider(connection, wallet, {
      preflightCommitment: "confirmed",
    });
  }, [wallet]);

  if (provider){
    anchor.setProvider(provider);
  }

  const program = useMemo(() => {
    if (!provider) return null;
    return new anchor.Program(idl as CompanyRegistration, {connection});
  }, [provider]);

  const companyRegistrationPDA = useMemo(() => {
    if (!program || !wallet || !wallet.publicKey) return null;
    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("company"), wallet.publicKey.toBuffer()],
      program.programId
    );
    return pda;
  }, [program]);
  
  return {
    program,
    provider,
    companyRegistrationPDA,
  }
}

export type CompanyRegistrationData = IdlAccounts<CompanyRegistration>["company"];