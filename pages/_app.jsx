// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { AuthProvider } from '../backend/AuthContext';

import { AppProps } from 'next/app';
import { MantineProvider, createTheme } from '@mantine/core';

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function App({ Component, pageProps } ) {
  return (
    <AuthProvider>
      <MantineProvider theme={theme}>  
          <Component {...pageProps} />
      </MantineProvider>
    </AuthProvider>
  );
}