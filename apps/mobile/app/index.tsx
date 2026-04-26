import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

/**
 * Auth gate. Decides which group to send the user to based on Clerk session.
 *
 * TODO (Week 2): once `users.onboarding_completed_at` exists, signed-in users
 * who haven't finished onboarding redirect to /awaken. For now, all signed-in
 * users go to /ledger.
 */
export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/sign-in" />;
  return <Redirect href="/ledger" />;
}
