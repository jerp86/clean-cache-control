class LocalSavePurchases {
  constructor(private readonly cacheStore: ICacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete("purchases");
  }
}

interface ICacheStore {
  delete: (key: string) => void;
}

class CacheStoreSpy implements ICacheStore {
  deleteCallsCount = 0;
  key: string;

  delete(key: string): void {
    this.deleteCallsCount++;
    this.key = key;
  }
}

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
    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
    expect(cacheStore.key).toBe("purchases");
  });
});
