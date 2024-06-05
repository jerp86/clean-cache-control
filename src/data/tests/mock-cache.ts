import { SavePurchases } from "@/domain/usecases";
import { ICacheStore } from "../protocols/cache";

export class CacheStoreSpy implements ICacheStore {
  messages: Array<CacheStoreSpy.Message> = [];
  deleteKey: string;
  insertKey: string;
  insertValues: Array<SavePurchases.Params>;

  delete(key: string): void {
    this.messages.push(CacheStoreSpy.Message.delete);
    this.deleteKey = key;
  }

  insert(key: string, value: unknown): void {
    this.messages.push(CacheStoreSpy.Message.insert);
    this.insertKey = key;
    this.insertValues = value as Array<SavePurchases.Params>;
  }

  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.delete);
      throw new Error();
    });
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
      this.messages.push(CacheStoreSpy.Message.insert);
      throw new Error();
    });
  }
}

export namespace CacheStoreSpy {
  export enum Message {
    delete,
    insert,
  }
}
