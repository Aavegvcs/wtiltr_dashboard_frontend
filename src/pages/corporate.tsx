import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CorporateView } from 'src/sections/corporate/corporate-view';



// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Corporate - ${CONFIG.appName}`}</title>
      </Helmet>
      <CorporateView />
      
    </>
  );
}
