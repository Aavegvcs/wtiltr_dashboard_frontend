import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { InsuranceCompanyView } from 'src/sections/insurance-company/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Insurance Company - ${CONFIG.appName}`}</title>
      </Helmet>

      <InsuranceCompanyView />
    </>
  );
}
