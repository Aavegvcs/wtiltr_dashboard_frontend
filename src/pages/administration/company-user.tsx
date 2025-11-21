import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EmployeeView } from 'src/sections/user/insurance-user';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Users - ${CONFIG.appName}`}</title>
      </Helmet>

      <EmployeeView />
    </>
  );
}
