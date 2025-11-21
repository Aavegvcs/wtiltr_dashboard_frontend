import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Car } from 'lucide-react';
import { formatToCamelCase } from 'src/utils/utils';
import { VehicleDetails } from 'src/utils/globalTypes';
import { Vehicle_Category } from 'src/utils/insurance.utils';

export default function VehicleDetailsAccordion({
  vehicleDetails,
}: {
  vehicleDetails?: VehicleDetails;
}) {
  // console.log("in vehicle details Accordion", vehicleDetails);
  
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6" className="flex items-center gap-2 mb-2 text-gray-800">
          <Car size={18} aria-label="Vehicle icon" /> Vehicle Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {vehicleDetails ? (
          <Box
            pl={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.6, // 1.5 * 8px = 12px gap
              color: 'text.secondary',
            }}
          >
            {/* <Typography variant="body2">
              <span className="font-medium text-gray-800">Vehicle Type:</span>{' '}
              <span className="text-gray-700">{formatToCamelCase(vehicleDetails.vehicleType)}</span>
            </Typography> */}
            <Typography variant="body2">
              <span className="font-medium text-gray-800">Vehicle Category:</span>{' '}
              <span className="text-gray-700">
                {formatToCamelCase(vehicleDetails.vehicleCategory)}
              </span>
            </Typography>

            {vehicleDetails.vehicleCategory === Vehicle_Category.Miscellaneous && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Other Vehicle Category:</span>{' '}
                <span className="text-gray-700">
                  {formatToCamelCase(vehicleDetails.othersVehicleCategory)}
                </span>
              </Typography>
            )}
            {(vehicleDetails.vehicleCategory === Vehicle_Category.PrivateCar ||
              vehicleDetails.vehicleCategory === Vehicle_Category.PassengerCarryingVehicle) && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Seating Capacity:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.seatingCapacity}</span>
              </Typography>
            )}

            {vehicleDetails.vehicleCategory === Vehicle_Category.GoodsCarryingVehicle && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Gross Vehicle Weight:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.grossVehicleWeight}</span>
              </Typography>
            )}
            <Typography variant="body2">
              <span className="font-medium text-gray-800">Over Turning:</span>{' '}
              <span className="text-gray-700">{vehicleDetails.overTurning ? 'Yes' : 'No'}</span>
            </Typography>

            <Typography variant="body2">
              <span className="font-medium text-gray-800">No Claim Bonus:</span>{' '}
              <span className="text-gray-700">{vehicleDetails.noClaimBonus ? 'Yes' : 'No'}</span>
            </Typography>

            {vehicleDetails.noClaimBonus === true && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">How Much On Pre Policy:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.noClaimBonusOnPrePolicy}</span>
              </Typography>
            )}

            <Typography variant="body2">
              <span className="font-medium text-gray-800">Vehicle Number:</span>{' '}
              <span className="text-gray-700">{vehicleDetails.vehicleNumber}</span>
            </Typography>

            {vehicleDetails.makingYear && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Making Year:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.makingYear}</span>
              </Typography>
            )}

            {vehicleDetails.vehicleName && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Vehicle Name:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.vehicleName}</span>
              </Typography>
            )}

            {vehicleDetails.modelNumber && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Model Number:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.modelNumber}</span>
              </Typography>
            )}

            {vehicleDetails.rcOwnerName && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">RC Owner:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.rcOwnerName}</span>
              </Typography>
            )}

            {vehicleDetails.engineNumber && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Engine Number:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.engineNumber}</span>
              </Typography>
            )}

            {vehicleDetails.chassisNumber && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Chassis Number:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.chassisNumber}</span>
              </Typography>
            )}

            {vehicleDetails.dateOfReg && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Date of Registration:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.dateOfReg}</span>
              </Typography>
            )}

            {vehicleDetails.madeBy && (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">Made By:</span>{' '}
                <span className="text-gray-700">{vehicleDetails.madeBy}</span>
              </Typography>
            )}
          </Box>
        ) : (
          <Typography>No vehicle details provided.</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
