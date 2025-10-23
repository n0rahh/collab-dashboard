import React from 'react';
import type { Counter, User } from '@/types/common.interfaces';
import styles from './Counter.module.scss';

type CounterProps = {
  counter: Counter;
  updateCounter: (value: number) => void;
  users: User[];
};

const Counter: React.FC<CounterProps> = ({ counter, updateCounter, users }) => {
  const lastUser = users.find((u) => u.id === counter?.lastUpdatedBy) ?? null;

  return (
    <div className={styles.counterWrapper}>
      <h2>Shared Counter</h2>
      <div className={styles.counterValue}>{counter.value}</div>
      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => updateCounter(counter.value - 1)}
          aria-label='Decrement'
        >
          -
        </button>
        <button
          className={styles.button}
          onClick={() => updateCounter(counter.value + 1)}
          aria-label='Increment'
        >
          +
        </button>
      </div>
      <div className={styles.info}>
        {lastUser ? (
          <>
            Last updated by <strong>{lastUser.name}</strong> at{' '}
            {new Date(counter.lastUpdatedAt).toLocaleTimeString()}
          </>
        ) : (
          <>No updates yet</>
        )}
      </div>
    </div>
  );
};

export default Counter;
