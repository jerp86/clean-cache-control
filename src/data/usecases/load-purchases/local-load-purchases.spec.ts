import { CacheStoreSpy, mockPurchases } from "@/data/tests";
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

describe("LocalLoadPurchases Suite Test", () => {
  it("should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });

  it("should return empty list if load fails", async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateFetchError();
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).not.toContainEqual(CacheStoreSpy.Action.insert);
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.fetch,
      CacheStoreSpy.Action.delete,
    ]);
    expect(cacheStore.deleteKey).toBe("purchases");
    expect(purchases).toEqual([]);
  });

  it("Should return a list of purchases if cache is less than 3 days old", async () => {
    const timestamp = new Date();
    const { cacheStore, sut } = makeSut(timestamp);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
    expect(purchases).toEqual(cacheStore.fetchResult?.value);
  });
});
