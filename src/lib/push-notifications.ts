import { env } from '../config/env';

export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications are not supported by the browser.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check if we are already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('User is already subscribed:', existingSubscription);
      return existingSubscription;
    }

    if (!env.vapidPublicKey) {
      console.warn('VAPID Public Key is missing. Push notifications will not work.');
      return;
    }

    // Convert VAPID key
    const convertedVapidKey = urlBase64ToUint8Array(env.vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey
    });

    console.log('Push Notification Subscription successful:', subscription);
    
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
