// Copyright (c) Microsoft. All rights reserved.

import { useMsal } from '@azure/msal-react';
import { Body1, Button, Image, Title3 } from '@fluentui/react-components';
import React from 'react';
import signInLogo from '../../ms-symbollockup_signin_light.svg';
import { useSharedClasses } from '../../styles';

import jwt_decode from 'jwt-decode';

import {
  GsiButton,
  GsiClient,
  IdTokenProvider,
  useIdToken
} from 'react-gsi';

import {
  ErrorFallback,
  IdleFallback,
  LoadingFallback
} from './Fallback';



const idConfiguration: IdConfiguration = {
  client_id: '944301045116-usq3bf0h2algmn9g39gp34qobs82171v.apps.googleusercontent.com',
  auto_select: false // automatically sign in, see: https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out
}

const buttonConfiguration: GsiButtonConfiguration = {
  type: 'standard',
  theme: 'outline',
  size: 'large',
}

const signOut = () => {
  // refresh the page
  window.location.reload();
}

const UserControlPanel = () => {
  const token = useIdToken();

  const signedOut = token === null;

  // useOneTap({
  //     show: signedOut
  // })

  if (signedOut) {
      return (
          <>
              <h1>Logged Out</h1>
              <GsiButton configuration={buttonConfiguration} />
          </>
      );
  } else {
      const { select_by, credential } = token;

      const jwt = jwt_decode(credential);

      return (
          <>
              <h1>Logged In via {select_by}</h1>
              <p>{credential}</p>
              <p>
              <pre style={{ maxHeight: '400px', overflow: 'auto', padding: '0.5em 0' }}>
                {JSON.stringify(jwt, null, 2)}
              </pre>
              </p>
              <button className="g_id_signout" onClick={() => signOut}>Sign Out</button>
          </>
      )
  }
}

export const Login: React.FC = () => {
    const { instance } = useMsal();
    const classes = useSharedClasses();

    return (
        <div className={classes.informativeView}>
            <Title3>Login with your Microsoft Account</Title3>
            <Body1>
                {"Don't have an account? Create one for free at"}{' '}
                <a href="https://account.microsoft.com/" target="_blank" rel="noreferrer">
                    https://account.microsoft.com/
                </a>
            </Body1>

            <Button
                style={{ padding: 0 }}
                appearance="transparent"
                onClick={() => {
                    instance.loginRedirect().catch(() => {});
                }}
            >
                <Image src={signInLogo} />
            </Button>

            <GsiClient idle={IdleFallback} loading={LoadingFallback} error={ErrorFallback}>
                <IdTokenProvider configuration={idConfiguration}>
                    <UserControlPanel />
                </IdTokenProvider>
            </GsiClient>
        </div>
    );
};
