export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type User = { email: string };

export type RootData = {
  stuff: any;
  userAgent: string;
};

export type ModalT = {
  id: string;
  isOpen: boolean;
  email?: string;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
