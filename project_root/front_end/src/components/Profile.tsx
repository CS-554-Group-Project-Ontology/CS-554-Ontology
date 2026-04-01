import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const imageUrl =
    currentUser?.photoURL ||
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <div className='flex justify-center items-center min-h-[60vh] bg-base-200'>
      <div className='card w-full max-w-md bg-base-100 shadow-xl p-6'>
        <div className='flex flex-col items-center'>
          <div className='avatar mb-4'>
            <div className='w-24 rounded-full'>
              <img src={imageUrl} alt='Profile' />
            </div>
          </div>
          <h2 className='text-2xl font-bold mb-2'>
            {currentUser?.displayName || "Anonymous User"}
          </h2>
          <p className='text-gray-600 mb-1'>
            {currentUser?.email || "No email available"}
          </p>
        </div>
        <div className='divider' />
        <div className='text-center text-sm text-gray-500'>
          Welcome to your profile page!
        </div>
      </div>
    </div>
  );
};

export default Profile;
