import { useState, useEffect } from 'react';

// SearchableSelect Component
interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select a neighborhood',
  disabled = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (searchTerm) {
      setFilteredOptions(
        options.filter((option) =>
          option.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className='relative w-full'>
      <div
        className={`input input-bordered w-full flex items-center justify-between cursor-pointer ${
          disabled ? 'input-disabled bg-base-200' : ''
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={!value ? 'text-base-content/50' : ''}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </div>

      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className='fixed inset-0 z-10'
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className='absolute z-20 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-80 overflow-hidden'>
            {/* Search Input */}
            <div className='p-2 border-b border-base-300'>
              <input
                type='text'
                className='input input-bordered input-sm w-full'
                placeholder='Search neighborhood...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>

            {/* Options List - Scrollable */}
            <div className='overflow-y-auto max-h-64'>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => (
                  <div
                    key={index}
                    className={`px-3 py-2 cursor-pointer hover:bg-base-200 transition-colors ${
                      value === option ? 'bg-primary/10 text-primary' : ''
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </div>
                ))
              ) : (
                <div className='px-3 py-4 text-center text-base-content/50'>
                  No neighborhoods found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchableSelect;
