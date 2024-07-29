
import amplifyconfig from '../src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

import React from 'react';
import { Button } from 'react-native';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import { Amplify } from 'aws-amplify';
import config from'../src/amplifyconfiguration.json';

Amplify.configure(config);

function SignOutButton() {
  const { signOut } = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
}

export default function Index() {
  return (
    <Authenticator.Provider>
      <Authenticator>
        <SignOutButton />
      </Authenticator>
    </Authenticator.Provider>
  );
}
