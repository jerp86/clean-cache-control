import { CacheStoreSpy, mockPurchases } from "@/data/tests";
import { LocalSavePurchases } from "@/data/usecases";

type SutTypes = {
  cacheStore: CacheStoreSpy;
  sut: LocalSavePurchases;
};

const makeSut = (timestamp = new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore, timestamp);

  return { cacheStore, sut };
};

describe("LocalSavePurchases Suite Tests", () => {
  it("should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.messages).toEqual([]);
  });

  it("should not insert new Cache if delete fails", async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete]);
    expect(cacheStore.messages).not.toContain(CacheStoreSpy.Message.insert);
    await expect(promise).rejects.toThrow();
  });

  it("should insert new Cache if delete succeeds", async () => {
    const timestamp = new Date();
    const { cacheStore, sut } = makeSut(timestamp);
    const purchases = mockPurchases();
    await sut.save(purchases);

    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
    expect(cacheStore.deleteKey).toBe("purchases");
    expect(cacheStore.insertKey).toBe("purchases");
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases,
    });
  });

  it("should throw if insert throws", async () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateInsertError();
    const promise = sut.save(mockPurchases());

    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
    await expect(promise).rejects.toThrow();
  });
});
