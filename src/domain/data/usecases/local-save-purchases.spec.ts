class LocalSavePurchases {
  constructor(private readonly cacheStore: ICacheStore) {}

  async save(): Promise<void> {
    this.cacheStore.delete();
  }
}

interface ICacheStore {
  delete: () => void;
}

class CacheStoreSpy implements ICacheStore {
  deleteCallsCount = 0;

  delete() {
    this.deleteCallsCount++;
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

  it("should delete cache on sut.delete", async () => {
    const { cacheStore, sut } = makeSut();
    await sut.save();

    expect(cacheStore.deleteCallsCount).toBe(1);
  });
});
