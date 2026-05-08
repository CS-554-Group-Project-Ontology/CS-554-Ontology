import { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { doSignOut } from '../firebase/FirebaseFunctions';
import { AFFORDABILITY_CITY_LIST } from '../pages/Affordability/affordabilityCityConfig';
import { Menu } from 'lucide-react';

const DEFAULT_AVATAR = '/default-avatar.png';

function Navigation() {
  const { currentUser } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const authNavItems = [
    { to: '/', label: 'Landing' },
    { to: '/mobility', label: 'Mobility' },
    { to: '/foundations', label: 'Foundations' },
    { to: '/news', label: 'News' },
  ];

  const unauthNavItems = [
    { to: '/', label: 'Landing' },
    { to: '/signin', label: 'Sign In' },
    { to: '/signup', label: 'Sign Up' },
  ];

  const navItems = currentUser ? authNavItems : unauthNavItems;

  async function handleSignOut() {
    try {
      await doSignOut();
    } catch (err) {
      alert((err as Error).message);
    }
  }

  return (
    <header className='bg-base-300 sticky top-0 z-50 shadow-sm'>
      <nav className='container mx-auto flex items-center justify-between px-4 py-3'>
        <div className='flex items-center justify-center gap-3 lg:justify-start'>
          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-amber-500 text-sm font-black text-white shadow-sm'>
            O
          </div>
          <div>
            <NavLink to='/'>
              <p className='text-xl font-black tracking-tight text-slate-900'>
                Ontology
              </p>
            </NavLink>
          </div>
        </div>

        <button
          className='btn btn-ghost lg:hidden'
          aria-label='Toggle mobile menu'
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <Menu className='h-6 w-6' />
        </button>

        <ul className='hidden items-center gap-4 lg:flex'>
          {navItems.map((item) => (
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

          {currentUser && (
            <>
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
                  {AFFORDABILITY_CITY_LIST.map((cityConfig) => (
                    <li key={cityConfig.slug}>
                      <NavLink to={`/affordability/${cityConfig.slug}`}>
                        {cityConfig.cityTitle}
                      </NavLink>
                    </li>
                  ))}
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
                      alt='Avatar'
                      src={currentUser?.photoURL?.trim() || DEFAULT_AVATAR}
                      className='h-full w-full object-cover'
                      onError={(event) => {
                        event.currentTarget.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                </div>
                <ul
                  tabIndex={1}
                  className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 gap-2 shadow'
                >
                  <li>
                    <NavLink to='/profile'>Profile</NavLink>
                  </li>
                  <li>
                    <button onClick={handleSignOut}>Sign Out</button>
                  </li>
                </ul>
              </div>
            </>
          )}
        </ul>
      </nav>

      {mobileMenuOpen && (
        <div className='border-t border-slate-200 bg-base-100 px-4 py-3 lg:hidden'>
          <ul className='flex flex-col gap-2'>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium ${
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

            {currentUser && (
              <>
                <li className='mt-2'>
                  <div className='px-3 py-2 text-sm font-semibold text-slate-500'>
                    Affordability
                  </div>
                </li>

                {AFFORDABILITY_CITY_LIST.map((cityConfig) => (
                  <li key={cityConfig.slug}>
                    <NavLink
                      to={`/affordability/${cityConfig.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm font-medium ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-slate-700 hover:bg-slate-200'
                        }`
                      }
                    >
                      {cityConfig.cityTitle}
                    </NavLink>
                  </li>
                ))}

                <li>
                  <NavLink to='/profile'>Profile</NavLink>
                </li>
                <li>
                  <button onClick={handleSignOut}>Sign Out</button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}

export default Navigation;
