import { Box, Grid, Typography } from '@mui/material';
import { Insurance_Type } from 'src/utils/insurance.utils';
import { formatToCamelCase } from 'src/utils/utils';

const TicketDataShow = ({ ticketData }: { ticketData: any }) => {
  return (
    <>
      {ticketData ? (
        <Box sx={{ ml: 2 }}>
          <Grid container spacing={2}>
            {/* Common Fields */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Ticket Number:
              </Typography>
              <Typography>{ticketData?.ticketNumber}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Insurance Type:
              </Typography>
              <Typography>{formatToCamelCase(ticketData?.insuranceType)}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Ticket Status:
              </Typography>
              <Typography>{formatToCamelCase(ticketData?.ticketStatus)}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Preferred Company:
              </Typography>
              <Typography>{ticketData?.preferredCompany || 'N/A'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Preferred Product:
              </Typography>
              <Typography>{ticketData?.preferredProduct || 'N/A'}</Typography>
            </Grid>

            {/* HEALTH Specific Fields */}
            {ticketData?.insuranceType === Insurance_Type.Health && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Policy Holder Type:
                  </Typography>
                  <Typography>{formatToCamelCase(ticketData.policyHolderType) || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Coverage Required:
                  </Typography>
                  <Typography>{ticketData.coveragedRequired || 'N/A'}</Typography>
                </Grid>
              </>
            )}

            {/* LIFE Specific Fields */}
            {ticketData?.insuranceType === Insurance_Type.Life && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Insurance Purpose:
                  </Typography>
                  <Typography>{formatToCamelCase(ticketData.insurancePurpose) || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Premium Payment Term:
                  </Typography>
                  <Typography>{ticketData.PrimiumPaymentTerm || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Policy Term:
                  </Typography>
                  <Typography>{ticketData.policyTerm || 'N/A'}</Typography>
                </Grid>
              </>
            )}

            {/* MOTOR Specific Fields */}
            {ticketData?.insuranceType === Insurance_Type.Motor && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Previous Policy Number:
                  </Typography>
                  <Typography>{ticketData.prePolicyNumber || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Previous Insurance Company:
                  </Typography>
                  <Typography>{ticketData.preInsuranceComapny || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Previous IDF:
                  </Typography>
                  <Typography>{ticketData.preIdf || 'N/A'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Previous Year Claim:
                  </Typography>
                  <Typography>{ticketData.isPreYearClaim ? 'Yes' : 'No'}</Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Coverage Type:
                  </Typography>
                  <Typography>{formatToCamelCase(ticketData.coverageType) || 'N/A'}</Typography>
                </Grid>
              </>
            )}

            {/* Common Fields at Bottom */}
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Endorsement To Be Noted:
              </Typography>
              <Typography>{ticketData?.endorsmentToNoted || 'N/A'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Agent Remarks:
              </Typography>
              <Typography>{ticketData?.agentRemarks || 'N/A'}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="body2" color="text.secondary">
                Others Remarks:
              </Typography>
              <Typography>{ticketData?.othersRemarks || 'N/A'}</Typography>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Typography variant="body1" sx={{ m: 2, color: 'text.secondary' }}>
          Loading ticket data...
        </Typography>
      )}
    </>
  );
};

export default TicketDataShow;
