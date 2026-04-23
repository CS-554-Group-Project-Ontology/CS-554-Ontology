import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type ProfileStatusBannerProps = {
  isEmpty: boolean;
  messageProfileIncomplete?: string;
  messageProfileComplete?: string;
  pathLink?: string;
  pathLinkText?: string;
};

function ProfileStatusBanner({
  isEmpty,
  messageProfileIncomplete = 'Your economic profile is incomplete. Fill it out below to unlock the affordability map and personalized insights.',
  messageProfileComplete = 'Your economic profile is complete.',
  pathLink = '/affordability-nyc',
  pathLinkText = 'View Affordability Map',
}: ProfileStatusBannerProps) {
  const message = isEmpty ? messageProfileIncomplete : messageProfileComplete;

  return (
    <div
      role='alert'
      className={`alert ${isEmpty ? 'alert-warning' : 'alert-success'} mb-6`}
    >
      {isEmpty ? (
        <AlertTriangle className='h-6 w-6 shrink-0' />
      ) : (
        <CheckCircle2 className='h-6 w-6 shrink-0' />
      )}
      <span>{message}</span>
      {!isEmpty && (
        <Link to={pathLink} className='btn btn-sm btn-primary'>
          {pathLinkText}
        </Link>
      )}
    </div>
  );
}

export default ProfileStatusBanner;
