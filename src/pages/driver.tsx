import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { DriverView } from 'src/sections/driver/driver-view';


export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Driver - ${CONFIG.appName}`}</title>
      </Helmet>
      <DriverView />
      
    </>
  );
}
