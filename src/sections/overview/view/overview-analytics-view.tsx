import React from 'react';
import { Box, Grid, Card, Skeleton } from '@mui/material';

export const OverviewAnalyticsView = () => {
  return (
    <Box p={4} bgcolor="#f5f6f8" minHeight="100vh">
      
      {/* ===================== ROW 1 → 4 SMALL CARDS ===================== */}
      
      <Grid container spacing={2} mb={3}>
        {[1, 2, 3, 4].map((_, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
              }}
            >
              <Skeleton width="60%" height={16} />
              <Skeleton width="40%" height={32} sx={{ mt: 1 }} />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ===================== ROW 2 → 2 COLUMNS ===================== */}
      <Grid container spacing={2}>
        
        {/* LEFT COLUMN → 2 CARDS */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {[1, 2].map((_, i) => (
              <Grid item xs={12} key={i}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <Skeleton width="50%" height={16} />
                  <Skeleton width="30%" height={28} sx={{ mt: 1 }} />
                  <Skeleton width="100%" height={10} sx={{ mt: 2 }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* RIGHT COLUMN → 2 CARDS */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {[1, 2].map((_, i) => (
              <Grid item xs={12} key={i}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  }}
                >
                  <Skeleton width="50%" height={16} />
                  <Skeleton width="30%" height={28} sx={{ mt: 1 }} />
                  <Skeleton width="100%" height={10} sx={{ mt: 2 }} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

      </Grid>
    </Box>
  );
};

export default OverviewAnalyticsView;
