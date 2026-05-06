import { env } from '../config/env';

export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    // Push unsupported
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check if we are already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      // Already subscribed
      return existingSubscription;
    }

    if (!env.vapidPublicKey) {
      return;
    }

    // Convert VAPID key
    const convertedVapidKey = urlBase64ToUint8Array(env.vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    // Subscription successful
    
    // Here we would send the subscription to our backend (Supabase or Vercel Function)
    // await saveSubscriptionToBackend(subscription);

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe the user to push notifications:', error);
  }
}

// Utility function
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
