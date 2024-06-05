import { CacheStoreSpy, mockPurchases } from "@/data/tests";
import { LocalSavePurchases } from "@/data/usecases";

type SutTypes = {
  cacheStore: CacheStoreSpy;
  sut: LocalSavePurchases;
};

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy();
  const sut = new LocalSavePurchases(cacheStore);

  return { cacheStore, sut };
};

describe("LocalSavePurchases Suite Tests", () => {
  it("should not delete or insert cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.messages).toEqual([]);
  });

  it("should delete cache on sut.save", async () => {
    const { cacheStore, sut } = makeSut();
    await sut.save(mockPurchases());

    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  it("should not insert new Cache if delete fails", () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateDeleteError();
    const promise = sut.save(mockPurchases());

    expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete]);
    expect(cacheStore.messages).not.toContain(CacheStoreSpy.Message.insert);
    expect(promise).rejects.toThrow();
  });

  it("should insert new Cache if delete succeeds", async () => {
    const { cacheStore, sut } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);

    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
    expect(cacheStore.insertKey).toBe("purchases");
    expect(cacheStore.insertValues).toEqual(purchases);
  });

  it("should throw if insert throws", () => {
    const { cacheStore, sut } = makeSut();
    cacheStore.simulateInsertError();
    const promise = sut.save(mockPurchases());

    expect(cacheStore.messages).toEqual([
      CacheStoreSpy.Message.delete,
      CacheStoreSpy.Message.insert,
    ]);
    expect(promise).rejects.toThrow();
  });
});
