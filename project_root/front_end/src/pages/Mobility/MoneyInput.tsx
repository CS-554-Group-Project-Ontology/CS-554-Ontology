type MoneyInputProps = {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  error?: string;
};

function MoneyInput({ label, value, onChange, error }: MoneyInputProps) {
  return (
    <div className='w-full'>
      <label className='mb-1 block text-sm font-medium'>{label}</label>
      <input
        type='number'
        min={0}
        placeholder='0'
        className={`input input-bordered w-full ${error ? 'input-error' : ''}`}
        value={value ?? ''}
        onChange={(e) =>
          onChange(e.target.value === '' ? undefined : Number(e.target.value))
        }
      />
      {error && <p className='mt-1 text-sm text-error'>{error}</p>}
    </div>
  );
}

export default MoneyInput;
