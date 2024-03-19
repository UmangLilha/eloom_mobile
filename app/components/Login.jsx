import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { app } from '../../firebase/firestore';


const auth = getAuth(app);

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);

  const sendVerification = () => {
    const phoneProvider = new RecaptchaVerifier(auth,'recaptcha-container',{});
    console.log(`phoneProvider:${phoneProvider}`);
    signInWithPhoneNumber(auth, phoneNumber, phoneProvider)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error sending verification code', error.message);
      });
  };

  const confirmCode = () => {
    const credential = RecaptchaVerifier.phoneAuthProvider.credential(
      verificationId,
      code
    );

    auth.signInWithCredential(credential)
      .then((result) => {
        console.log('User signed in with phone number');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Error verifying code', error.message);
      });
  };

  return (
    <View>
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

      {/* Invisible container for the reCAPTCHA */}
      {/* <div id="recaptcha-container" /> */}
    </View>
  );
};

export default Login;
