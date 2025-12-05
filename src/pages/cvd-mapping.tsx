import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { CvdView } from 'src/sections/cvd-mapping/cvd-view';


export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`CvdView - ${CONFIG.appName}`}</title>
      </Helmet>
      <CvdView />
      
    </>
  );
}
