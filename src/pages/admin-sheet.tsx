import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import {AdminTripSheetView} from 'src/sections/admin-sheet/admin-trip-sheet-view'


export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`AdminTripSheetView - ${CONFIG.appName}`}</title>
      </Helmet>
      <AdminTripSheetView />
      
    </>
  );
}
