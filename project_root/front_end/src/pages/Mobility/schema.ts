import { z } from 'zod';

export type Liabilities = {
  rent?: number;
  insuranceDeductibles?: number;
  utilities?: number;
  other?: number;
};

export type EconomicProfile = {
  income?: number;
  address?: string;
  liabilities?: Liabilities;
};

export type FieldErrors = {
  income?: string;
  address?: string;
  rent?: string;
  insuranceDeductibles?: string;
  utilities?: string;
  other?: string;
};

export const EMPTY_PROFILE: EconomicProfile = {
  income: undefined,
  address: '',
  liabilities: {
    rent: undefined,
    insuranceDeductibles: undefined,
    utilities: undefined,
    other: undefined,
  },
};

export const LIABILITY_FIELDS: Array<{
  key: keyof Liabilities;
  label: string;
}> = [
  { key: 'rent', label: 'Rent' },
  { key: 'insuranceDeductibles', label: 'Insurance' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'other', label: 'Other' },
];

const optionalNonNegative = z
  .number({ message: 'Must be a number' })
  .nonnegative('Must be 0 or greater')
  .optional();

export const profileSchema = z.object({
  income: z
    .number({ message: 'Income is required' })
    .nonnegative('Income must be 0 or greater'),
  address: z.string().trim().min(1, 'Address is required'),
  liabilities: z
    .object({
      rent: optionalNonNegative,
      insuranceDeductibles: optionalNonNegative,
      utilities: optionalNonNegative,
      other: optionalNonNegative,
    })
    .optional(),
});
