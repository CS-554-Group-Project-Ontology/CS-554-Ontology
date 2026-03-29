import { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doSignOut } from '../firebase/FirebaseFunctions';

function Navigation() {
  const { currentUser } = useContext(AuthContext);

  const authNavItems = [
    { to: '/', label: 'Landing' },
    { to: '/home', label: 'Home' },
  ];

  const unauthNavItems = [
    { to: '/', label: 'Landing' },
    { to: '/signin', label: 'Sign In' },
    { to: '/signup', label: 'Sign Up' },
  ];

  async function handleSignOut() {
    try {
      await doSignOut();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <header className="navbar bg-base-300 sticky top-0 z-50 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center justify-center gap-3 lg:justify-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-amber-500 text-sm font-black text-white shadow-sm">
            O
          </div>
          <div>
            <NavLink to='/'>
              <p className="text-xl font-black tracking-tight text-slate-900">
                Ontology
              </p>
            </NavLink>
          </div>
        </div>

        <ul className="flex items-center justify-start gap-2 overflow-x-auto pb-1 lg:justify-end lg:overflow-visible lg:pb-0">
          {currentUser ? (
            <>
              {authNavItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `btn btn-ghost rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <div className='dropdown dropdown-hover'>
                <div
                  tabIndex={0}
                  role='button'
                  className='btn btn-ghost rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200'
                >
                  Affordability
                </div>
                <ul
                  tabIndex={1}
                  className='dropdown-content menu bg-base-100 rounded-lg z-1 w-52 p-2 shadow-sm'
                >
                  <li>
                    <Link to='/home/affordability-nyc'>New York City</Link>
                  </li>
                  <li>
                    <Link to='/'>San Francisco</Link>
                  </li>
                  <li>
                    <Link to='/'>Houston</Link>
                  </li>
                </ul>
              </div>
              <div className='dropdown dropdown-end'>
                <div
                  tabIndex={0}
                  role='button'
                  className='btn btn-ghost btn-circle avatar'
                >
                  <div className='w-10 rounded-full'>
                    <img
                      alt='Tailwind CSS Navbar component'
                      src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
                    />
                  </div>
                </div>
                <ul
                  tabIndex={1}
                  className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'
                >
                  <li>
                    <Link to='/profile' className='justify-between'>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to='/settings' className='justify-between'>
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button className='justify-between' onClick={handleSignOut}>
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {unauthNavItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `btn btn-ghost rounded-lg px-3 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
