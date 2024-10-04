import { atom } from "recoil";

export interface User {
  userId: string;
  username: string;
  email: string;
  phoneNumber: string;
}

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
