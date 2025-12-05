import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import {TripSheetView} from 'src/sections/tripsheet/index'


export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Trip Sheet - ${CONFIG.appName}`}</title>
      </Helmet>
      <TripSheetView />
      
    </>
  );
}
