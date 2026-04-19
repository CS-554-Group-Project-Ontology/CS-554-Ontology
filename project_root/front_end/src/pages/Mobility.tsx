import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { editUserApi, getUserApi } from '../api';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import type { GetUserByUUIDData, GetUserByUUIDVars } from '../types';
import queries from '../queries';
import Loading from '../components/Loading';

type Liabilities = {
  rent?: number;
  insuranceDeductibles?: number;
  utilities?: number;
  other?: number;
};

type EconomicProfile = {
  income?: number;
  address?: string;
  liabilities?: Liabilities;
};

function Mobility() {
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [economicProfile, setEconomicProfile] = useState<EconomicProfile>({
    income: 0,
    address: '',
    liabilities: {
      rent: 0,
      insuranceDeductibles: 0,
      utilities: 0,
      other: 0,
    },
  });

  const {
    loading: isUserEconomicProfileLoading,
    error,
    data,
  } = useQuery<GetUserByUUIDData, GetUserByUUIDVars>(queries.GET_USER_BY_UUID, {
    variables: { uuid: currentUser?.uid || '' },
    fetchPolicy: 'cache-and-network',
  });

  // check if the user economic profile is empty (address & income)
  const isUserEconomicProfileEmpty =
    !data?.getUserByUUID?.economic_profile ||
    Object.keys(data?.getUserByUUID?.economic_profile).length === 0 ||
    (data?.getUserByUUID?.economic_profile?.address === null &&
      data?.getUserByUUID?.economic_profile?.income === null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUser) return;
        const profile = await getUserApi();
        setEconomicProfile({
          income: profile.economic_profile?.income ?? 0,
          address: profile.economic_profile?.address ?? '',
          liabilities: {
            rent: profile.economic_profile?.liabilities?.rent ?? 0,
            insuranceDeductibles:
              profile.economic_profile?.liabilities?.insuranceDeductibles ?? 0,
            utilities: profile.economic_profile?.liabilities?.utilities ?? 0,
            other: profile.economic_profile?.liabilities?.other ?? 0,
          },
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent, payload: EconomicProfile) => {
    e.preventDefault();
    if (loading) return;
    if (
      payload.income === undefined &&
      payload.address === undefined &&
      !payload.liabilities
    ) {
      return;
    }
    try {
      setLoading(true);
      await editUserApi(payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isUserEconomicProfileLoading) {
    return <Loading />;
  }

  if (!error) {
    return <div className='text-red-500'>{error}</div>;
  }

  return (
    <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
      <h1 className='text-3xl font-bold mb-4'>Mobility</h1>

      {/* Show alert if user economic profile is not complete */}
      {isUserEconomicProfileEmpty ? (
        <div className='mb-6 rounded-lg p-4'>
          <div role='alert' className='alert alert-error alert-soft mb-6 p-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 shrink-0 stroke-current'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
            <p className='text-md text-red-700'>
              Your economic profile is incomplete. Please update it below to see
              the affordability map and get personalized insights.
            </p>
          </div>
        </div>
      ) : (
        <div className='mb-6 rounded-lg p-4'>
          <div role='alert' className='alert alert-info alert-soft mb-6 p-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 shrink-0 stroke-current'
              fill='none'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
            <p className='text-md text-green-700'>
              Your economic profile is complete. You can view the affordability
              map and get personalized insights.
            </p>
            <Link
              to='/affordability-nyc'
              className='rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700 hover:bg-sky-200'
            >
              View Affordability Map
            </Link>
          </div>
        </div>
      )}

      {/* Economic profile form to be updated */}
      <div className='mobilityBox'>
        <form
          className='incomeInput'
          onSubmit={(e) =>
            handleSubmit(e, { income: Number(economicProfile.income) })
          }
        >
          <h2>Income</h2>
          <input
            type='number'
            value={economicProfile.income ?? ''}
            onChange={(e) =>
              setEconomicProfile((prev) => ({
                ...prev,
                income:
                  e.target.value === '' ? undefined : Number(e.target.value),
              }))
            }
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Saving.' : 'Save'}
          </button>
        </form>
      </div>
      <div className='mobilityBox'>
        <form
          className='addressInput'
          onSubmit={(e) =>
            handleSubmit(e, { address: economicProfile.address })
          }
        >
          <h2>Address</h2>
          <textarea
            value={economicProfile.address ?? ''}
            onChange={(e) =>
              setEconomicProfile((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Saving.' : 'Save'}
          </button>
        </form>
      </div>
      <div className='mobilityBox'>
        <h2>Liabilities</h2>
        <div className='liabilitiesBox'>
          <form
            className='rentInput'
            onSubmit={(e) =>
              handleSubmit(e, {
                liabilities: {
                  rent: Number(economicProfile.liabilities?.rent),
                },
              })
            }
          >
            <h2>Rent</h2>
            <input
              type='number'
              value={economicProfile.liabilities?.rent ?? ''}
              onChange={(e) =>
                setEconomicProfile((prev) => ({
                  ...prev,
                  liabilities: {
                    ...(prev.liabilities || {}),
                    rent:
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                  },
                }))
              }
            />
            <button type='submit' disabled={loading}>
              {loading ? 'Saving.' : 'Save'}
            </button>
          </form>
        </div>
        <div className='liabilitiesBox'>
          <form
            className='insuranceInput'
            onSubmit={(e) =>
              handleSubmit(e, {
                liabilities: {
                  insuranceDeductibles: Number(
                    economicProfile.liabilities?.insuranceDeductibles,
                  ),
                },
              })
            }
          >
            <h2>Insurance</h2>
            <input
              type='number'
              value={economicProfile.liabilities?.insuranceDeductibles ?? ''}
              onChange={(e) =>
                setEconomicProfile((prev) => ({
                  ...prev,
                  liabilities: {
                    ...prev.liabilities,
                    insuranceDeductibles:
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                  },
                }))
              }
            />
            <button type='submit' disabled={loading}>
              {loading ? 'Saving.' : 'Save'}
            </button>
          </form>
        </div>
        <div className='liabilitiesBox'>
          <form
            className='utilitiesInput'
            onSubmit={(e) =>
              handleSubmit(e, {
                liabilities: {
                  utilities: Number(economicProfile.liabilities?.utilities),
                },
              })
            }
          >
            <h2>Utilities</h2>
            <input
              type='number'
              value={economicProfile.liabilities?.utilities ?? ''}
              onChange={(e) =>
                setEconomicProfile((prev) => ({
                  ...prev,
                  liabilities: {
                    ...prev.liabilities,
                    utilities:
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                  },
                }))
              }
            />
            <button type='submit' disabled={loading}>
              {loading ? 'Saving.' : 'Save'}
            </button>
          </form>
        </div>
        <div className='liabilitiesBox'>
          <form
            className='otherInput'
            onSubmit={(e) =>
              handleSubmit(e, {
                liabilities: {
                  other: Number(economicProfile.liabilities?.other),
                },
              })
            }
          >
            <h2>Other</h2>
            <input
              type='number'
              value={economicProfile.liabilities?.other ?? ''}
              onChange={(e) =>
                setEconomicProfile((prev) => ({
                  ...prev,
                  liabilities: {
                    ...prev.liabilities,
                    other:
                      e.target.value === ''
                        ? undefined
                        : Number(e.target.value),
                  },
                }))
              }
            />
            <button type='submit' disabled={loading}>
              {loading ? 'Saving.' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Mobility;
