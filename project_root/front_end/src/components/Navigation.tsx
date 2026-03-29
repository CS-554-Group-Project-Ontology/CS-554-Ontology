import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doSignOut } from '../firebase/FirebaseFunctions';

function Navigation() {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <NavLink to='/' className="btn btn-ghost text-xl">Ontology</NavLink>
      </div>
      <div className="flex-none gap-2">
        {currentUser ? (
          <>
            <NavLink to='/home' className="btn btn-ghost">Home</NavLink>
            <button className="btn btn-ghost" onClick={doSignOut}>Sign Out</button>
          </>
        ) : (
          <>
            <NavLink to='/signin' className="btn btn-ghost">Sign In</NavLink>
            <NavLink to='/signup' className="btn btn-ghost">Sign Up</NavLink>
          </>
        )}
      </div>
    </div>
  );
}

export default Navigation;
