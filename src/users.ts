import { User } from "./types";

const users: User[] = [];

let a: number;

export const addUser = ({ id, username, room }: User) => {
  username = username.trim();
  room = room.trim();

  const existingUser = users.find(
    (user) => user.room === room && user.username === username,
  );

  if (!username || !room) return { error: "Username and room are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, username, room };

  users.push(user);
  return { user };
};

export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

export const getUser = (id: string) => users.find((user) => user.id === id);

export const getUsersInRoom = (room: string) =>
  users.filter((user) => user.room === room);
