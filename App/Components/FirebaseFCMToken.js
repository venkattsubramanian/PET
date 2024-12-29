import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

export function getDeviceToken() {
    return new Promise((resolve, reject) => {
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });

        messaging().onMessage(async remoteMessage => {
            console.log('Message handled in the foreground!', remoteMessage);
            PushNotification.localNotification({
                title: remoteMessage.data.title,
                message: remoteMessage.data.body,
            });
        });

        messaging().requestPermission()
            .then(() => {
                console.log('Permission granted');
                return messaging().getToken();
            })
            .then(token => {
                resolve(token);
            })
            .catch(error => {
                console.log('Permission rejected or error getting device token:', error);
                reject(error);
            });
    });
}
