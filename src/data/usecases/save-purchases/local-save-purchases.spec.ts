import { ICacheStore } from "@/data/protocols/cache";
import { LocalSavePurchases } from "@/data/usecases";
import { SavePurchases } from "@/domain";

class CacheStoreSpy implements ICacheStore {
  deleteCallsCount = 0;
  insertCallsCount = 0;
  deleteKey: string;
  insertKey: string;
  insertValues: Array<SavePurchases.Params>;

  delete(key: string): void {
    this.deleteCallsCount++;
    this.deleteKey = key;
  }

  insert(key: string, value: unknown): void {
    this.insertCallsCount++;
    this.insertKey = key;
    this.insertValues = value as Array<SavePurchases.Params>;
  }
}

const mockPurchases = (): Array<SavePurchases.Params> => [
  {
    id: "1",
    date: new Date(),
    value: 50,
  },
  {
    id: "2",
    date: new Date(),
    value: 70,
  },
];

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
  it("should not delete cache on sut.init", () => {
    const { cacheStore } = makeSut();
    expect(cacheStore.deleteCallsCount).toBe(0);
  });

  it("should delete cache on sut.save", async () => {
    const { cacheStore, sut } = makeSut();
    await sut.save(mockPurchases());

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.deleteKey).toBe("purchases");
  });

  it("should not insert new Cache if delete fails", async () => {
    const { cacheStore, sut } = makeSut();
    jest.spyOn(cacheStore, "delete").mockImplementationOnce(() => {
      throw new Error();
    });
    const promise = sut.save(mockPurchases());

    expect(promise).rejects.toThrow();
    expect(cacheStore.insertCallsCount).toBe(0);
  });

  it("should insert new Cache if delete succeeds", async () => {
    const { cacheStore, sut } = makeSut();
    const purchases = mockPurchases();
    await sut.save(purchases);

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.insertCallsCount).toBe(1);
    expect(cacheStore.insertKey).toBe("purchases");
    expect(cacheStore.insertValues).toEqual(purchases);
  });
});
