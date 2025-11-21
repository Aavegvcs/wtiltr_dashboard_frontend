import { Accordion, AccordionSummary, AccordionDetails, Typography, Box } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Car, FileText, User, Users } from 'lucide-react';
import { formatToCamelCase } from 'src/utils/utils';
import { documents } from 'src/utils/globalTypes';

export default function DocumentsAccordion({ documents }: { documents?: documents[] }) {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6" className="flex items-center gap-2 mb-2 text-gray-800">
          <FileText size={18} aria-label="Documents icon" /> Documents
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {documents && documents.length > 0 ? (
          <Box className="pl-2 text-gray-700 space-y-2">
            {documents.map((doc, idx) => (
              <Typography variant="body2">
                <span className="font-medium text-gray-800">
                  {' '}
                  📄 {formatToCamelCase(doc.name)}:{' '}
                </span>{' '}
                <span style={{ marginLeft: '8px' }}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#1976d2',
                      textDecoration: 'underline',
                      fontWeight: 500,
                    }}
                  >
                    View
                  </a>
                </span>
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography>No documents uploaded.</Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
}
