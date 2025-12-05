import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { VehicleView } from 'src/sections/vehicle/vehicle-view';


export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Vehicle - ${CONFIG.appName}`}</title>
      </Helmet>
      <VehicleView />
      
    </>
  );
}
