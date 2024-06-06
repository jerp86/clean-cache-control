import {
  CacheStoreSpy,
  getCacheExpirationDate,
  mockPurchases,
} from "@/data/tests";
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

  it("should delete cache if load fails", () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateFetchError();
    sut.validate();

    expect(cacheStore.actions).not.toContainEqual(CacheStoreSpy.Action.insert);
    expect(cacheStore.actions).toContainEqual(CacheStoreSpy.Action.delete);
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.deleteKey).toBe(KEY);
  });

  it(`should has no side effect if load succeeds`, () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() + 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = { timestamp };
    sut.validate();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe(KEY);
  });
});
