import React from 'react';
import styles from './UserList.module.scss';

type User = {
  id: string;
  name: string;
  lastActive: number;
  isTyping?: boolean;
};

type UserListProps = {
  users: User[];
};

const UserList: React.FC<UserListProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.lastActive - a.lastActive);

  return (
    <aside className={styles.userList}>
      <h3>Active Users ({users.length})</h3>
      <ul className={styles.list}>
        {sortedUsers.map((user) => (
          <li
            key={user.id}
            className={styles.userItem}
          >
            <div
              className={styles.statusIndicator}
              title={user.isTyping ? 'Typing...' : 'Active'}
              data-typing={user.isTyping ? 'true' : 'false'}
            />
            <span className={styles.userName}>{user.name}</span>
            <time
              className={styles.lastActive}
              dateTime={new Date(user.lastActive).toISOString()}
            >
              {new Date(user.lastActive).toLocaleTimeString()}
            </time>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default UserList;
