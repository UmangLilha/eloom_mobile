import React, { useState, useRef } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { getAuth, signInWithPhoneNumber, signInWithCredential, PhoneAuthProvider, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { app } from '../../firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId,setVerificationId] = useState('');
  const recaptchaVerifier = useRef(null);

  const sendVerification = async () => {
    //const confirmCode = await auth().signInWithPhoneNumber(phoneNumber);

    // const phoneProvider = new firebase.auth.PhoneAuthProvider();
    // phoneProvider.verifyPhoneNumber(phoneNumber,recaptchaVerifier.current)
    // .then(setVerificationId);
    // setPhoneNumber('');
    // let promise = "clear";
    console.log(app.options);
     signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier.current)
      .then((confirmationResult) => {
        
        setVerificationId(confirmationResult.verificationId);
        console.log(`verificationid:${confirmationResult.verificationId}`);      
    })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error sending verification code', error.message);
      });
  };

  const confirmCode = async () => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, code);
    const result = await signInWithCredential(auth, credential);
    
   
    console.log('User signed in with phone number');
    console.log(`User UID: ${result.user.uid}`);
    
    
  } catch (error) {
    console.error(error);
    Alert.alert('Error verifying code', error.message);

  }
};

  return (
    <View>
        <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={app.options} // Ensure your Firebase configuration is passed here
        attemptInvisibleVerification={true}
      />
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone number"
        autoCompleteType="tel"
      />
      <Button title="Send Verification" onPress={sendVerification} />

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Verification code"
      />
      <Button title="Confirm Code" onPress={confirmCode} />
    </View>
  );
};

export default Login;
