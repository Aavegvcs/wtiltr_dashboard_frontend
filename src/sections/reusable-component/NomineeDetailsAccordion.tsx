import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Car, HeartHandshake, User } from 'lucide-react';
import { formatToCamelCase } from 'src/utils/utils';
import { nomineeDetails } from 'src/utils/globalTypes';

export default function NomineeDetailsAccordion({
  nomineeDetails,
}: {
  nomineeDetails?: nomineeDetails;
}) {
  console.log("in noominee accro", nomineeDetails);
  
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6" className="flex items-center gap-2 mb-2 text-gray-800">
          <HeartHandshake size={18} aria-label="User icon" /> Nominee Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {nomineeDetails ? (
          <Box
            pl={2}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.6, // 1.5 * 8px = 12px gap
              color: 'text.secondary',
            }}
          >
            <Typography variant="body2">
              <span className="font-medium text-gray-800">Name:</span>{' '}
              <span className="text-gray-700">{nomineeDetails.name}</span>
            </Typography>

           
            <Typography variant="body2">
              <span className="font-medium text-gray-800">Gender:</span>{' '}
              <span className="text-gray-700">{nomineeDetails.gender}</span>
            </Typography>

                <Typography variant="body2">
              <span className="font-medium text-gray-800">Date Of Birth:</span>{' '}
              <span className="text-gray-700">{nomineeDetails.dateOfBirth}</span>
            </Typography>

            <Typography variant="body2">
              <span className="font-medium text-gray-800">Relation:</span>{' '}
              <span className="text-gray-700">{formatToCamelCase(nomineeDetails.relation)}</span>
            </Typography>

             <Typography variant="body2">
              <span className="font-medium text-gray-800">Contact:</span>{' '}
              <span className="text-gray-700">{nomineeDetails.contactNumber}</span>
            </Typography>

          </Box>
        ) : (
          <Typography>No nominee details provided.</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
