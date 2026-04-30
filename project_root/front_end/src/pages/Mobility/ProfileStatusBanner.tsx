import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type ProfileStatusBannerProps = {
  isProfileEmpty: boolean;
  message?: string;
  showLink?: boolean;
};

function ProfileStatusBanner({
  isProfileEmpty,
  showLink = false,
}: ProfileStatusBannerProps) {
  const message = isProfileEmpty
    ? 'Your economic profile is incomplete. Fill it out below to unlock the affordability map and personalized insights.'
    : 'Your economic profile is complete. You can now view the affordability map and personalized insights.';

  const pathLink = isProfileEmpty ? '/mobility' : '/affordability-nyc';
  const pathLinkText = isProfileEmpty
    ? 'Update your economic profile'
    : 'View Affordability Map';

  return (
    <div
      role='alert'
      className={`alert ${isProfileEmpty ? 'alert-warning' : 'alert-success'} mb-6`}
    >
      {isProfileEmpty ? (
        <AlertTriangle className='h-6 w-6 shrink-0' />
      ) : (
        <CheckCircle2 className='h-6 w-6 shrink-0' />
      )}
      <span>{message}</span>
      {showLink && (
        <Link to={pathLink} className='btn btn-sm btn-primary cursor-pointer'>
          {pathLinkText}
        </Link>
      )}
    </div>
  );
}

export default ProfileStatusBanner;
