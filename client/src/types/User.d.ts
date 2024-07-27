export type User = {
  _id: string;
  uid: string;
  name: string;
  email: string;
  photoURL: string;
};

export type FriendRequest = {
  from: string;
  to: string;
  _id: string;
  createdAt: string;
};
