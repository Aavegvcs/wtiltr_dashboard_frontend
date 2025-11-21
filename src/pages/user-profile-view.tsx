import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import UserProfileView from 'src/sections/user/view/user-profile-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`User Profile - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
