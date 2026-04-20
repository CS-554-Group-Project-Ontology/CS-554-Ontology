import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

function Home() {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser?.displayName && !currentUser?.email) {
    return <Loading />;
  }

  return (
    <div className='m-8 space-y-4'>
      <h1 className='text-4xl font-bold'>Ontology Dashboard</h1>
      <p>
        Hello,{" "}
        <span className='font-bold'>
          {currentUser.displayName || currentUser.email}!
        </span>
      </p>
      <p className='text-lg text-gray-700'>
        This is your personalized dashboard where you can explore various
        features of the Ontology app. Use the navigation bar to access different
        sections and manage your account.
      </p>
    </div>
  );
}

export default Home;