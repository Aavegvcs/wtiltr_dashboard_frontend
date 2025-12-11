import React from 'react';
import { Box, Grid, Card, Typography } from '@mui/material';

export const AgentAnalyticsView = () => {
  const stats = [
    { title: 'My Vehicles', value: 120 },
    { title: 'My Drivers', value: 98 },
    { title: "Today's Trips", value: 26 },
    { title: 'Total Trips', value: 1450 },
    { title: 'Active Vehicles', value: 110 },
    { title: 'Inactive Vehicles', value: 10 },
  ];

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Agent Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #388e3c, #66bb6a)',
                color: '#fff',
              }}
            >
              <Typography variant="subtitle1">{item.title}</Typography>
              <Typography variant="h4" fontWeight={700}>
                {item.value}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AgentAnalyticsView;
