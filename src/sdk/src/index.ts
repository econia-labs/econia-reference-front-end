
import { AptosClient } from "aptos";
import { AptosParserRepo, AptosLocalCache, AptosSyncedCache, u8, u64, u128 } from "@manahippo/move-to-ts";
import * as aptos_faucet from './aptos_faucet';
import * as econia from './econia';
import * as stdlib from './stdlib';

export * as aptos_faucet from './aptos_faucet';
export * as econia from './econia';
export * as stdlib from './stdlib';

export { u8, u64, u128 };

export function getProjectRepo(): AptosParserRepo {
  const repo = new AptosParserRepo();
  aptos_faucet.loadParsers(repo);
  econia.loadParsers(repo);
  stdlib.loadParsers(repo);
  repo.addDefaultParsers();
  return repo;
}

export class App {
  parserRepo: AptosParserRepo;
  cache: AptosLocalCache;
  aptos_faucet : aptos_faucet.App
  econia : econia.App
  stdlib : stdlib.App
  constructor(
    public client: AptosClient,
  ) {
    this.parserRepo = getProjectRepo();
    this.cache = new AptosLocalCache();
    this.aptos_faucet = new aptos_faucet.App(client, this.parserRepo, this.cache);
    this.econia = new econia.App(client, this.parserRepo, this.cache);
    this.stdlib = new stdlib.App(client, this.parserRepo, this.cache);
  }
}
