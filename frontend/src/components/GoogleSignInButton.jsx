import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

// Drop-in Google Sign-In button used on both the Login and Register pages.
// Handles both cases identically on the backend: if the Google account's
// email matches an existing customer, it logs them in; otherwise it creates
// a new account automatically. So the same button works for "sign in" and
// "sign up" - matching how Google Identity Services is meant to be used.
const GoogleSignInButton = ({ label = 'continue_with' }) => {
  const { googleLogin } = useCustomerAuth();
  const navigate = useNavigate();
  const configured = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!configured) {
    return (
      <div className="text-xs text-charcoal-400 border border-dashed border-charcoal-300 dark:border-charcoal-700 rounded-md px-4 py-3 text-center">
        Google Sign-In isn't configured yet. Set <code className="text-amber-600">VITE_GOOGLE_CLIENT_ID</code> in
        frontend/.env to enable it.
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        text={label}
        shape="pill"
        width="100%"
        onSuccess={async (credentialResponse) => {
          try {
            await googleLogin(credentialResponse.credential);
            toast.success('Signed in with Google!');
            navigate('/account');
          } catch (err) {
            toast.error(err.message || 'Google sign-in failed');
          }
        }}
        onError={() => toast.error('Google sign-in was cancelled or failed')}
      />
    </div>
  );
};

export default GoogleSignInButton;
