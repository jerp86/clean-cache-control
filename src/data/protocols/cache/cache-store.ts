interface IValue {
  timestamp: Date;
  value: any;
}

export interface ICacheStore {
  delete: (key: string) => void;
  fetch: (key: string) => any;
  insert: (key: string, value: IValue) => void;
  replace: (key: string, value: IValue) => void;
}
