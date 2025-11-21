import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { BranchView } from 'src/sections/branch/view';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Branch - ${CONFIG.appName}`}</title>
      </Helmet>
      <BranchView />
      
    </>
  );
}
