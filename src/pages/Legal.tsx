import { Navigate, useParams } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import CookiePolicy from './CookiePolicy';
import Disclaimer from './Disclaimer';

export default function Legal() {
  const { type } = useParams<{ type: string }>();

  if (type === 'privacy') return <PrivacyPolicy />;
  if (type === 'terms') return <TermsOfService />;
  if (type === 'cookies') return <CookiePolicy />;
  if (type === 'disclaimer') return <Disclaimer />;

  return <Navigate to="/privacy" replace />;
}
