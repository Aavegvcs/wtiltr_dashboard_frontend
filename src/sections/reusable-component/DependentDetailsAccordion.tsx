import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Car, User, Users } from 'lucide-react';
import { formatToCamelCase } from 'src/utils/utils';

 interface dependentDetails {
  name: string;
  gender: string;
  dob: string;
  mobileNumber: string;
  email?: string | null;
  relation: string;
}[];
export default function DependentDetailsAccordion({
  dependentDetails,
}: {
  dependentDetails?: dependentDetails[];
}) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6" className="flex items-center gap-2 mb-2 text-gray-800">
          <Users size={18} aria-label="Dependents icon" /> Dependent Details
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {dependentDetails?.length ? (
          <Box className="pl-2 text-gray-700 space-y-2">
            {dependentDetails.map((dep, idx) => (
              <Box key={idx} className="border-b pb-2">
                <Typography variant="body2">

                  <span className="font-medium text-gray-800"> Dependent{idx+1}.</span>{' '}
                </Typography>
                <Typography variant="body2">
                  <span className="font-medium text-gray-800">Name:</span>{' '}
                  <span className="text-gray-700">{dep.name}</span>
                  {/* 👤 {dep.name} ({dep.relation}) */}
                </Typography>
                <Typography variant="body2">
                  <span className="font-medium text-gray-800"> DOB:</span>{' '}
                  <span className="text-gray-700">{dep.dob}</span>
                </Typography>
                <Typography variant="body2">
                  <span className="font-medium text-gray-800"> Mobile:</span>{' '}
                  <span className="text-gray-700">{dep.mobileNumber}</span>
                </Typography>

                <Typography>
                  <span className="font-medium text-gray-800"> Email:</span>{' '}
                  <span className="text-gray-700">{dep.email}</span>
                </Typography>
                <Typography>
                  <span className="font-medium text-gray-800"> Relations:</span>{' '}
                  <span className="text-gray-700">{formatToCamelCase(dep.relation)}</span>
                </Typography>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>No dependent details provided.</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
