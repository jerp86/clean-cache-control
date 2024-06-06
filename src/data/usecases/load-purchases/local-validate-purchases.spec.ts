import { CacheStoreSpy } from "@/data/tests";
import { LocalLoadPurchases } from "./local-load-purchases";

type SutType = {
  cacheStore: CacheStoreSpy;
  sut: LocalLoadPurchases;
};

const makeSut = (timestamp = new Date()): SutType => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalLoadPurchases(cacheStore, timestamp);

  return { cacheStore, sut };
};

describe("LocalValidatePurchases Suite Test", () => {
  const KEY = "purchases";

  it("should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });
});
