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
    !savedProfile.address ||
    savedProfile.address.trim().length === 0;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!currentUser) return;
        const profile = await getUserApi();
        const loaded: EconomicProfile = {
          income: profile.economic_profile?.income,
          address: profile.economic_profile?.address ?? '',
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
    const trimmedAddress = (economicProfile.address ?? '').trim();
    if (trimmedAddress && trimmedAddress !== (baseline.address ?? '').trim()) {
      payload.address = trimmedAddress;
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
          <h2 className='text-xl font-semibold'>Income & Address</h2>

          <MoneyInput
            label='Annual income'
            value={economicProfile.income}
            onChange={(value) =>
              setEconomicProfile((prev) => ({ ...prev, income: value }))
            }
            error={errors.income}
          />

          <div className='w-full'>
            <label className='mb-1 block text-sm font-medium'>Address</label>
            <textarea
              className={`textarea textarea-bordered w-full ${
                errors.address ? 'textarea-error' : ''
              }`}
              rows={2}
              placeholder='Street, City, State'
              value={economicProfile.address ?? ''}
              onChange={(e) =>
                setEconomicProfile((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
            {errors.address && (
              <p className='mt-1 text-sm text-error'>{errors.address}</p>
            )}
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
