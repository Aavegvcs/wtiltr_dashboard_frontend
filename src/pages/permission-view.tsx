import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PermissionView } from 'src/sections/role-permission-mapping/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Permission View - ${CONFIG.appName}`}</title>
      </Helmet>

      <PermissionView />
    </>
  );
}
