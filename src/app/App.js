import { Suspense } from 'react';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import history from '@history';
import { Router } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import FuseLoading from '@fuse/core/FuseLoading';
import axios from 'axios';
import { Auth } from './auth';
import withAppProviders from './withAppProviders';

/**
 * Axios HTTP Request defaults
 */
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const App = () => {
  return (
    <Auth>
      <Router history={history}>
        <Suspense fallback={<FuseLoading />}>
          <FuseAuthorization>
            <FuseTheme>
              <SnackbarProvider
                maxSnack={5}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                classes={{
                  containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                }}
              >
                <FuseLayout />
              </SnackbarProvider>
            </FuseTheme>
          </FuseAuthorization>
        </Suspense>
      </Router>
    </Auth>
  );
};

export default withAppProviders(App)();
