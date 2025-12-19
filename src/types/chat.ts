export type Chat = {
  id: number | string;
  name: string;
  profileImage?: string;
  lastMessage?: string;
  lastTime?: string;
  unread?: number;
};

export type Message = {
  id: number | string;
  fromMe: boolean;
  text: string;
  time?: string; // formatted time string (HH:mm)
};
