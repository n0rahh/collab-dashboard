import { useCollaborativeSession } from './hooks/useCollaborativeSession';

import Counter from '@/components/Counter/Counter';
import UserList from '@/components/UserList/UserList';

export default function App() {
  const { users, counter, updateCounter } = useCollaborativeSession();

  return (
    <div>
      <UserList users={users} />
      <Counter
        counter={counter}
        updateCounter={updateCounter}
        users={users}
      />
    </div>
  );
}
