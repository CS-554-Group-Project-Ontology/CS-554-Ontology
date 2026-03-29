import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';

function Home() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser?.displayName) {
    return <Loading />;
  }

  return (
    <div className="m-8 space-y-4">
      <h1 className="text-4xl font-bold">Home</h1>
      <p>Hello, {currentUser.displayName}.</p>
    </div>
  );
}

export default Home;
