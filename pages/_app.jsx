// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { AuthProvider } from '../backend/AuthContext';

import { AppProps } from 'next/app';
import { MantineProvider, createTheme } from '@mantine/core';
// import {Notifications} from '@mantine/notifications'

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App({ Component, pageProps } ) {
  return (
    <AuthProvider>
      <MantineProvider theme={theme}>  
          {/* <Notifications> */}
            <Component {...pageProps} />
          {/* </Notifications> */}
      </MantineProvider>
    </AuthProvider>
  );
}