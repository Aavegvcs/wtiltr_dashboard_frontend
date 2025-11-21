import React from 'react';

import { Box, keyframes } from '@mui/material';

const blink = keyframes`
  0% { content: '.'; }
  25% { content: '..'; }
  50% { content: '...'; }
  75% { content: ''; }
  100% { content: '.'; }
`;

const AnimatedDots = () => (
  <Box
    component="span"
    sx={{
      '&::after': {
        content: "'...'",
        animation: `${blink} 1.5s steps(4, end) infinite`,
        display: 'inline-block',
        whiteSpace: 'pre',
      },
    }}
  />
);

export default AnimatedDots;
