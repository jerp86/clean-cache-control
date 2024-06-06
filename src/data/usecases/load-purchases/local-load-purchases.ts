import { CachePolicy, ICacheStore } from "@/data/protocols/cache";
import { LoadPurchases, SavePurchases } from "@/domain/usecases";

export class LocalLoadPurchases implements SavePurchases, LoadPurchases {
  private readonly key = "purchases";
  constructor(
    private readonly cacheStore: ICacheStore,
    private readonly currentDate: Date
  ) {}

  async save(purchases: Array<SavePurchases.Params>): Promise<void> {
    this.cacheStore.replace(this.key, {
      timestamp: this.currentDate,
      value: purchases,
    });
  }

  async loadAll(): Promise<Array<LoadPurchases.Result>> {
    try {
      const cache = this.cacheStore.fetch(this.key);
      if (CachePolicy.validate(cache.timestamp, this.currentDate)) {
        return cache?.value;
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  validate(): void {
    try {
      this.cacheStore.fetch(this.key);
    } catch (error) {
      this.cacheStore.delete(this.key);
    }
  }
}
