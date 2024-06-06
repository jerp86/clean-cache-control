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

describe("LocalLoadPurchases Suite Test", () => {
  const KEY = "purchases";

  it("should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();

    expect(cacheStore.actions).toEqual([]);
  });

  it("should return empty list if load fails", async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateFetchError();
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).not.toContainEqual(CacheStoreSpy.Action.insert);
    expect(cacheStore.actions).not.toContainEqual(CacheStoreSpy.Action.delete);
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(purchases).toEqual([]);
  });

  it(`should return a list of purchases if cache is valid`, async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() + 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe(KEY);
    expect(purchases).toEqual(cacheStore.fetchResult?.value);
  });

  it(`should return an empty list if cache is expired`, async () => {
    const currentDate = new Date();
    const timestamp = getCacheExpirationDate(currentDate);
    timestamp.setSeconds(timestamp.getSeconds() - 1);
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp,
      value: mockPurchases(),
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).not.toContainEqual(CacheStoreSpy.Action.delete);
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe(KEY);
    expect(purchases).toEqual([]);
  });

  it(`should return an empty list if cache is on expiration date`, async () => {
    const currentDate = new Date();
    const { cacheStore, sut } = makeSut(currentDate);
    cacheStore.fetchResult = {
      timestamp: getCacheExpirationDate(currentDate),
      value: mockPurchases(),
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).not.toContainEqual(CacheStoreSpy.Action.delete);
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe(KEY);
    expect(purchases).toEqual([]);
  });

  it("should return an empty list if cache is empty", async () => {
    const timestamp = new Date();
    const { cacheStore, sut } = makeSut(timestamp);
    cacheStore.fetchResult = {
      timestamp,
      value: [],
    };
    const purchases = await sut.loadAll();

    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch]);
    expect(cacheStore.fetchKey).toBe(KEY);
    expect(purchases).toEqual([]);
  });
});
