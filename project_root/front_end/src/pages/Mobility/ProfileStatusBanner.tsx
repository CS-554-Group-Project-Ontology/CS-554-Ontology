import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

type ProfileStatusBannerProps = {
  isEmpty: boolean;
};

function ProfileStatusBanner({ isEmpty }: ProfileStatusBannerProps) {
  if (isEmpty) {
    return (
      <div role='alert' className='alert alert-warning mb-6'>
        <AlertTriangle className='h-6 w-6 shrink-0' />
        <span>
          Your economic profile is incomplete. Fill it out below to unlock the
          affordability map and personalized insights.
        </span>
      </div>
    );
  }

  return (
    <div role='alert' className='alert alert-success mb-6'>
      <CheckCircle2 className='h-6 w-6 shrink-0' />
      <span>Your economic profile is complete.</span>
      <Link to='/affordability-nyc' className='btn btn-sm btn-primary'>
        View Affordability Map
      </Link>
    </div>
  );
}

export default ProfileStatusBanner;
