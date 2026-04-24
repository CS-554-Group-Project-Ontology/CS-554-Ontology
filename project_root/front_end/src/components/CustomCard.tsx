interface CustomCardProps {
  title?: string;
  numberText?: string;
  features?: string[];
  badgeText?: string;
  icon?: React.ReactNode;
  footerButtonText?: string;
  footerButtonAction?: () => void;
  content?: React.ReactNode;
  width?: string;
}

const CustomCard = ({
  title,
  numberText,
  badgeText,
  icon,
  footerButtonText,
  footerButtonAction,
  content,
  width = 'w-90',
}: CustomCardProps) => {
  return (
    <div
      className={`card ${width} bg-base-100 p-4 mb-4 border border-slate-200 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg hover:scale-102 rounded-lg`}
    >
      <div className='card-body'>
        <div className='flex justify-between items-start'>
          <span className='badge badge-sm badge-primary'>{badgeText}</span>
          {icon && (
            <span className='badge badge-primary badge-lg inline-flex h-10 w-10 items-center justify-center rounded-full p-0 text-xl font-semibold leading-none'>
              {icon}
            </span>
          )}
        </div>
        <div className='flex justify-between'>
          <h2 className='text-2xl font-bold'>{title}</h2>
          <span className='badge badge-primary badge-lg inline-flex h-10 w-10 items-center justify-center rounded-full p-0 text-xl font-semibold leading-none'>
            {numberText}
          </span>
        </div>
        {content && <div className='mt-4'>{content}</div>}
        {footerButtonAction && (
          <button
            className={`btn btn-primary btn-sm mt-4`}
            onClick={footerButtonAction}
          >
            {footerButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomCard;
