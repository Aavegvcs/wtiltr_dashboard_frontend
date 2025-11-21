import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Car, User } from 'lucide-react';
import { formatToCamelCase } from 'src/utils/utils';
import { insuredDetails } from 'src/utils/globalTypes';

export default function InsuredDetailsAccordion({
  insuredDetails,
}: {
  insuredDetails?: insuredDetails;
}) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6" className="flex items-center gap-2 mb-2 text-gray-800">
          <User size={18} aria-label="User icon" /> Insured Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {insuredDetails ? (
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
              <span className="text-gray-700">{insuredDetails?.name}</span>
            </Typography>

            <Typography variant="body2">
              <span className="font-medium text-gray-800">Gender:</span>{' '}
              <span className="text-gray-700">
                {formatToCamelCase(insuredDetails?.gender)}
              </span>
            </Typography>

            <Typography variant="body2">
              <span className="font-medium text-gray-800">Date Of Birth:</span>{' '}
              <span className="text-gray-700">{insuredDetails?.dateOfBirth}</span>
            </Typography>

            <Typography variant="body2">
              <span className="font-medium text-gray-800">Contact:</span>{' '}
              <span className="text-gray-700">{insuredDetails?.primaryContactNumber}</span>
            </Typography>

            <Typography variant="body2">
              <span className="font-medium text-gray-800">Email:</span>{' '}
              <span className="text-gray-700">{insuredDetails?.emailId}</span>
            </Typography>
          </Box>
        ) : (
          <Typography>No insured details provided.</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
