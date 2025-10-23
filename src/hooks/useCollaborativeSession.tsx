import { useCallback, useEffect, useRef, useState } from 'react';
import { useBroadcastChannel } from 'react-broadcast-sync';
import { v4 as uuidv4 } from 'uuid';
import type {
  BroadcastPayload,
  Counter,
  User,
} from '@/types/common.interfaces';

export function useCollaborativeSession(username?: string) {
  const userId = useRef<string>(uuidv4());
  const userName = useRef(
    username ?? `User-${Math.floor(Math.random() * 1000)}`,
  );

  const { postMessage: rawPostMessage, messages } =
    useBroadcastChannel('collab-session');

  const postMessage = useCallback(
    (...args: Parameters<typeof rawPostMessage>) => rawPostMessage(...args),
    [rawPostMessage],
  );

  const counterRef = useRef<Counter>({
    value: 0,
    lastUpdatedBy: userId.current,
    lastUpdatedAt: Date.now(),
  });

  const [users, setUsers] = useState<User[]>([]);
  const [counter, setCounter] = useState<Counter>(counterRef.current);

  const processedCount = useRef(0);

  const currentUser = useRef<User>({
    id: userId.current,
    name: userName.current,
    lastActive: Date.now(),
  });
  const usersRef = useRef<Record<string, User>>({
    [currentUser.current.id]: currentUser.current,
  });

  useEffect(() => {
    usersRef.current[currentUser.current.id] = currentUser.current;

    postMessage('USER_JOIN', { user: currentUser.current });

    postMessage('SYNC_STATE', {
      state: { users: usersRef.current, counter: counterRef.current },
    });

    setUsers(Object.values(usersRef.current));
    setCounter(counterRef.current);
  }, []);

  useEffect(() => {
    if (messages.length <= processedCount.current) return;

    let newUsers = { ...usersRef.current };
    let newCounter = { ...counterRef.current };
    let changed = false;

    for (let i = processedCount.current; i < messages.length; i++) {
      const msg = messages[i] as unknown as BroadcastPayload;

      if (msg.type === 'SYNC_STATE' && msg.state) {
        newUsers = { ...newUsers, ...msg.state.users };
        if (msg.state.counter.lastUpdatedAt > newCounter.lastUpdatedAt) {
          newCounter = msg.state.counter;
        }
        continue;
      }

      switch (msg.type) {
        case 'USER_JOIN':
          newUsers[msg.user.id] = msg.user;
          changed = true;
          break;
        case 'USER_LEAVE':
          delete newUsers[msg.userId];
          changed = true;
          break;
        case 'UPDATE_COUNTER':
          if (msg.counter.lastUpdatedAt > newCounter.lastUpdatedAt) {
            newCounter = msg.counter;
            changed = true;
          }
          break;
      }
    }

    processedCount.current = messages.length;

    if (changed) {
      usersRef.current = newUsers;
      counterRef.current = newCounter;
      setUsers(Object.values(newUsers));
      setCounter(newCounter);
    }
  }, [messages]);
  useEffect(() => {
    const handleUnload = () =>
      postMessage('USER_LEAVE', { userId: currentUser.current.id });
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  useEffect(() => {
    const handleUnload = () => {
      postMessage('USER_LEAVE', { userId: userId.current });
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [postMessage]);

  const updateCounter = useCallback(
    (value: number) => {
      const newCounter: Counter = {
        value,
        lastUpdatedBy: userId.current,
        lastUpdatedAt: Date.now(),
      };
      counterRef.current = newCounter;
      setCounter(newCounter);
      postMessage('UPDATE_COUNTER', { counter: newCounter });
    },
    [postMessage],
  );

  return {
    users,
    counter,
    updateCounter,
  };
}
