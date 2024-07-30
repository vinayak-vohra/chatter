export type UserBase = {
  _id: string;
  uid: string;
  name: string;
  email: string;
  photoURL: string;
};

export type User = UserBase & {
  friends: UserBase[];
};

export type FriendRequest = {
  from: string;
  to: string;
  _id: string;
  createdAt: string;
};
