import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { RolePermissionMappingView } from 'src/sections/role-permission-mapping/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Role Permission Mapping - ${CONFIG.appName}`}</title>
      </Helmet>

      <RolePermissionMappingView />
    </>
  );
}
