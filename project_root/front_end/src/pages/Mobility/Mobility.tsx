import { useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { AuthContext } from '../../context/AuthContext';
import { editUserApi, getUserApi } from '../../api';
import type { GetMeData } from '../../types';
import queries from '../../queries';
import Loading from '../../components/Loading';
import MoneyInput from './MoneyInput';
import ProfileStatusBanner from './ProfileStatusBanner';
import {
  EMPTY_PROFILE,
  LIABILITY_FIELDS,
  profileSchema,
  type EconomicProfile,
  type FieldErrors,
  type Liabilities,
} from './schema';
import SearchableSelect from './SearchableSelect';
import { CITY_OPTIONS } from '../../constants';

function Mobility() {
  const { currentUser } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [economicProfile, setEconomicProfile] =
    useState<EconomicProfile>(EMPTY_PROFILE);
  const [errors, setErrors] = useState<FieldErrors>({});
  const baselineRef = useRef<EconomicProfile>(EMPTY_PROFILE);

  const {
    loading: isUserEconomicProfileLoading,
    error,
    data,
    refetch,
  } = useQuery<GetMeData>(queries.GET_ME, {
    fetchPolicy: 'cache-and-network',
  });

  const savedProfile = data?.getMe?.economic_profile;
  const isUserEconomicProfileEmpty =
    !savedProfile ||
    savedProfile.income == null ||
    !savedProfile.city ||
    savedProfile.city.trim().length === 0 ||
    !savedProfile.neighborhood ||
    savedProfile.neighborhood.trim().length === 0;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUser) return;
        const profile = await getUserApi();
        const loaded: EconomicProfile = {
          income: profile.economic_profile?.income,
          city: profile.economic_profile?.city ?? '',
          neighborhood: profile.economic_profile?.neighborhood ?? '',
          liabilities: {
            rent: profile.economic_profile?.liabilities?.rent,
            insuranceDeductibles:
              profile.economic_profile?.liabilities?.insuranceDeductibles,
            utilities: profile.economic_profile?.liabilities?.utilities,
            other: profile.economic_profile?.liabilities?.other,
          },
        };
        baselineRef.current = loaded;
        setEconomicProfile(loaded);
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const buildChangedPayload = (): EconomicProfile => {
    const baseline = baselineRef.current;
    const payload: EconomicProfile = {};

    if (economicProfile.income !== baseline.income) {
      payload.income = economicProfile.income;
    }
    const trimmedCity = (economicProfile.city ?? '').trim();
    if (trimmedCity && trimmedCity !== (baseline.city ?? '').trim()) {
      payload.city = trimmedCity;
    }
    const trimmedNeighborhood = (economicProfile.neighborhood ?? '').trim();
    if (
      trimmedNeighborhood &&
      trimmedNeighborhood !== (baseline.neighborhood ?? '').trim()
    ) {
      payload.neighborhood = trimmedNeighborhood;
    }

    const liabilities: Liabilities = {};
    const currentLiab = economicProfile.liabilities ?? {};
    const baselineLiab = baseline.liabilities ?? {};
    LIABILITY_FIELDS.forEach(({ key }) => {
      if (currentLiab[key] !== baselineLiab[key]) {
        liabilities[key] = currentLiab[key];
      }
    });
    if (Object.keys(liabilities).length > 0) {
      payload.liabilities = liabilities;
    }

    return payload;
  };

  const hasChanges = Object.keys(buildChangedPayload()).length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    const result = profileSchema.safeParse(economicProfile);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const [head, tail] = issue.path;
        const key = (tail ?? head) as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    const payload = buildChangedPayload();
    if (Object.keys(payload).length === 0) return;

    try {
      setSaving(true);
      await editUserApi(payload);
      baselineRef.current = { ...economicProfile };
      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (isUserEconomicProfileLoading) {
    return <Loading />;
  }

  if (error && error.message !== 'User Not Found') {
    return <div className='text-red-500'>{error.message}</div>;
  }

  const canSubmit = hasChanges && !saving;

  return (
    <div className='container mx-auto max-w-3xl flex-1 px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>Mobility</h1>

      <ProfileStatusBanner isEmpty={isUserEconomicProfileEmpty} />

      <form onSubmit={handleSubmit} className='space-y-6'>
        <section className='rounded-box bg-base-100 p-6 shadow space-y-4'>
          <h2 className='text-xl font-semibold'>Income & Location</h2>

          <MoneyInput
            label='Annual income'
            value={economicProfile.income}
            onChange={(value) =>
              setEconomicProfile((prev) => ({ ...prev, income: value }))
            }
            error={errors.income}
          />

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='w-full'>
              <label className='mb-1 block text-sm font-medium'>City</label>
              <select
                className={`select select-bordered w-full ${
                  errors.city ? 'select-error' : ''
                }`}
                value={economicProfile.city ?? ''}
                onChange={(e) => {
                  const newCity = e.target.value;
                  setEconomicProfile((prev) => ({
                    ...prev,
                    city: newCity,
                    neighborhood: '',
                  }));
                }}
              >
                <option value='' disabled>
                  Select a city
                </option>
                {CITY_OPTIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className='mt-1 text-sm text-error'>{errors.city}</p>
              )}
            </div>

            <div className='w-full'>
              <label className='mb-1 block text-sm font-medium'>
                Neighborhood
              </label>

              {CITY_OPTIONS.includes(economicProfile.city || '') ? (
                <SearchableSelect
                  selectedCity={economicProfile.city || ''}
                  value={economicProfile.neighborhood || ''}
                  onChange={(value: string) =>
                    setEconomicProfile((prev) => ({
                      ...prev,
                      neighborhood: value,
                    }))
                  }
                  placeholder='Select a neighborhood'
                  disabled={!economicProfile.city}
                />
              ) : (
                <input
                  type='text'
                  className={`input input-bordered w-full ${
                    errors.neighborhood ? 'input-error' : ''
                  }`}
                  placeholder='e.g. Flushing'
                  value={economicProfile.neighborhood ?? ''}
                  onChange={(e) =>
                    setEconomicProfile((prev) => ({
                      ...prev,
                      neighborhood: e.target.value,
                    }))
                  }
                />
              )}

              {errors.neighborhood && (
                <p className='mt-1 text-sm text-error'>{errors.neighborhood}</p>
              )}
            </div>
          </div>
        </section>

        <section className='rounded-box bg-base-100 p-6 shadow space-y-4'>
          <h2 className='text-xl font-semibold'>Monthly Liabilities</h2>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {LIABILITY_FIELDS.map(({ key, label }) => (
              <MoneyInput
                key={key}
                label={label}
                value={economicProfile.liabilities?.[key]}
                onChange={(value) =>
                  setEconomicProfile((prev) => ({
                    ...prev,
                    liabilities: {
                      ...(prev.liabilities ?? {}),
                      [key]: value,
                    },
                  }))
                }
                error={errors[key]}
              />
            ))}
          </div>
        </section>

        <div className='flex justify-end'>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={!canSubmit}
          >
            {saving && <span className='loading loading-spinner loading-sm' />}
            {saving ? 'Saving' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Mobility;
