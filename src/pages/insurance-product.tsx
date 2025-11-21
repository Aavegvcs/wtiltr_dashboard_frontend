import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { InsuranceProductView } from 'src/sections/insurance-product/view';
// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Insurance Product - ${CONFIG.appName}`}</title>
      </Helmet>

      <InsuranceProductView />
    </>
  );
}
