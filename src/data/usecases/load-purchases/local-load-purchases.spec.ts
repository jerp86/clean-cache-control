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

describe("LocalLoadPurchases Suite Test", () => {
  it("should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });

  it("should call correct key on load", async () => {
    const { cacheStore, sut } = makeSut();
    await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe("purchases");
  });
});
