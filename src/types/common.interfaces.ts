export type User = {
  id: string;
  name: string;
  lastActive: number;
  isTyping?: boolean;
};

export type Message = {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  expiresAt?: number;
};

export type Counter = {
  value: number;
  lastUpdatedBy: string;
  lastUpdatedAt: number;
};

export type BroadcastPayload =
  | { type: 'USER_JOIN'; user: User }
  | { type: 'USER_LEAVE'; userId: string }
  | { type: 'UPDATE_COUNTER'; counter: Counter }
  | {
      type: 'SYNC_STATE';
      state: { users: Record<string, User>; counter: Counter };
    };
