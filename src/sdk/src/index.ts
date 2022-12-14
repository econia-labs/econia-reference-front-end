
import { AptosClient } from "aptos";
import { AptosParserRepo, AptosLocalCache, AptosSyncedCache, u8, u64, u128 } from "@manahippo/move-to-ts";
import * as econia from './econia';
import * as econia_wrappers from './econia_wrappers';
import * as stdlib from './stdlib';

export * as econia from './econia';
export * as econia_wrappers from './econia_wrappers';
export * as stdlib from './stdlib';

export { u8, u64, u128 };

export function getProjectRepo(): AptosParserRepo {
  const repo = new AptosParserRepo();
  econia.loadParsers(repo);
  econia_wrappers.loadParsers(repo);
  stdlib.loadParsers(repo);
  repo.addDefaultParsers();
  return repo;
}

export class App {
  parserRepo: AptosParserRepo;
  cache: AptosLocalCache;
  econia : econia.App
  econia_wrappers : econia_wrappers.App
  stdlib : stdlib.App
  constructor(
    public client: AptosClient,
  ) {
    this.parserRepo = getProjectRepo();
    this.cache = new AptosLocalCache();
    this.econia = new econia.App(client, this.parserRepo, this.cache);
    this.econia_wrappers = new econia_wrappers.App(client, this.parserRepo, this.cache);
    this.stdlib = new stdlib.App(client, this.parserRepo, this.cache);
  }
}
