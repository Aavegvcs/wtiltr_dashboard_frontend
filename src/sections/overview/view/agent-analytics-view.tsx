import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { _tasks, _posts, _timeline } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsEscalation } from '../analytics-escalation';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary, AnalyticsWidgetSummary2, BlankWidget } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import axiosInstance from 'src/config-global';
import { useEffect, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { getCardData } from '../common-function';
import { ColorType } from 'src/theme/core';
import { before } from 'node:test';
import { be } from 'date-fns/locale';
import { today } from 'src/utils/format-time';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { AnalyticsSoldPolicy } from '../AnalyticsSoldPolicy';
import { AnalyticsCustomerAge } from '../analytics-customer-age';
import { TimeRangeLabels } from 'src/utils/insurance.utils';

// ----------------------------------------------------------------------

export function AgemtAnalyticsView() {
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState<{
    caseStatus: any;
    fromDate: Dayjs | null;
    toDate: Dayjs | null;
    currentPage: number;
    pageSize: number;
  }>({
    caseStatus: null,
    fromDate: dayjs().subtract(7, 'day'), // 🔄 1 week before today
    toDate: dayjs(), // 🔄 today
    currentPage: 1,
    pageSize: 10,
  });
  const [escalationList, setEscalationList] = useState<any[]>([]);

  const [todayStats, setTodayStats] = useState<TicketStats | null>(null);
  const [yesterdayStats, setYesterdayStats] = useState<TicketStats | null>(null);
  const [beforeYesterdayStats, setBeforeYesterdayStats] = useState<TicketStats | null>(null);
  const [currentWeekStats, setCurrentWeekStats] = useState<TicketStats | null>(null);
  const [previousWeekStats, setPreviousWeekStats] = useState<TicketStats | null>(null);
  const [currentMonthStats, setCurrentMonthStats] = useState<TicketStats | null>(null);
  const [previousMonthStats, setPreviousMonthStats] = useState<TicketStats | null>(null);
  const [currentYearStats, setCurrentYearStats] = useState<TicketStats | null>(null);
  const [previousYearStats, setPreviousYearStats] = useState<TicketStats | null>(null);
  const [totalSoldStats, setTotalSoldStats] = useState<TotalSold | null>(null);

  const [userDetails, setUserDetails] = useState<Record<string, string> | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<keyof typeof TimeRangeLabels>('Today');
  
  const [monthWiseTicket, setMonthWiseTicket] = useState<{
    categories: string[];
    totalTicket: number[];
  } | null>(null);
  const [soldPolicyStats, setSoldPolicyStats] = useState<{
    categories: string[];
    series: Array<{ name: string; data: number[] }>;
  } | null>(null);
  useEffect(() => {
    const fetchEscalationCase = async () => {
      try {
        const payload = {
          ...filterData,
          fromDate: filterData.fromDate ? filterData.fromDate.format('YYYY-MM-DD') : null,
          toDate: filterData.toDate ? filterData.toDate.format('YYYY-MM-DD') : null,
        };

        const response = await axiosInstance.post(
          '/insurance-escalation/getEscalationCase',
          payload
        );

        // console.log('response', response.data.data.data);
        if (response.data.data.status === 'success') {
          const formattedData = response.data.data.data.map((item: any, index: number) => ({
            id: item.id || index,
            title: item.title || `Ticket ID: ${item.ticket_number || 'N/A'}`,
            description: item.descriptions || '',
            postedAt: item.created_at,
          }));
          // console.log('formattedData', formattedData);
          setEscalationList(formattedData || []);
        } else {
          setEscalationList([]);
        }
      } catch (error) {
        console.error('Error fetching escalation details:', error);
        setEscalationList([]);
      } finally {
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/insurance-dashboard/getAgentDashboardDetails');
        const result = response?.data?.data?.data;
        // console.log('result', result.totalSold);
        if (result?.statistics) {
          const stats = result.statistics;
          //  console.log('stats', stats.monthly);
          setTodayStats(stats.today || null);
          setYesterdayStats(stats.yesterday || null);
          setBeforeYesterdayStats(stats.before_yesterday || null);
          setCurrentWeekStats(stats.current_week || null);
          setPreviousWeekStats(stats.previous_week || null);
          setCurrentMonthStats(stats.monthly.current_month || null);
          setPreviousMonthStats(stats.monthly.previous_month || null);
          setMonthWiseTicket(stats.monthly.monthData || null);
          setCurrentYearStats(stats.current_year || null);
          setPreviousYearStats(stats.previous_year || null);
          setUserDetails(result.userDetails || null);
          setSoldPolicyStats(result.soldPolicy || null);
          setTotalSoldStats(result.totalSold || null);
        }
      } catch (error) {
        console.error('Error fetching dashboard details:', error);
      }
    };
    fetchEscalationCase();
    fetchDashboardData();
  }, [filterData]);

  const monthTicketData = {
    categories: monthWiseTicket?.categories || [],
    series: monthWiseTicket?.totalTicket || [], // Changed from totalTicket to series
  };

  const handleCreateMore = () => {
    navigate('/ticket-create'); // Navigate to CreateTicket page
  };
  const getSelectedStats = () => {
    switch (selectedFilter) {
      case 'Today':
        return {
          stats: todayStats,
          preStats: yesterdayStats,
          preTitle: 'Previous Day',
          color: 'primary' as ColorType,
        };
      case 'This Week':
        return {
          stats: currentWeekStats,
          preStats: previousWeekStats,
          preTitle: 'Previous Week',
          color: 'secondary' as ColorType,
        };
      case 'This Month':
        return {
          stats: currentMonthStats,
          preStats: previousMonthStats,
          preTitle: 'Previous Month',
          color: 'error' as ColorType,
        };
      case 'This Year':
        return {
          stats: currentYearStats,
          preStats: previousYearStats,
          preTitle: 'Previous Year',
          color: 'warning' as ColorType,
        };
      default:
        return {
          stats: todayStats,
          preStats: yesterdayStats,
          preTitle: 'Previous Day',
          color: 'primary' as ColorType,
        };
    }
  };

    const { stats, preStats, preTitle, color } = getSelectedStats();

  return (
    <DashboardContent maxWidth="xl">
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1} sx={{ mb: { xs: 3, md: 5 } }}>
          Hi, Welcome back 👋
        </Typography>
        {/* <Button
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleCreateMore}
          sx={{
            backgroundColor: '#0055A5',
            '&:hover': {
              backgroundColor: '#004080', // optional: darker shade on hover
            },
          }}
        >
          Create Ticket
        </Button> */}
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary
             title={selectedFilter}
            percent={stats?.growth || 0}
            total={stats?.total_tickets || 0}
            color={color}
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={monthTicketData}
            totalTickets={stats?.total_tickets || 0}
            totalOpen={stats?.total_open || 0}
            totalInProgress={stats?.total_in_progress || 0}
            totalClosed={stats?.total_closed || 0}
            totalSold = {stats?.total_sold || 0}
            growth={stats?.growth || 0}
            preTitle={preTitle}
            preTotalTickets={preStats?.total_tickets || 0}
            preTotalOpen={preStats?.total_open || 0}
            preTotalInProgress={preStats?.total_in_progress || 0}
            preTotalClosed={preStats?.total_closed || 0}
            preTotalSold = {preStats?.total_sold || 0}
            onFilterChange={setSelectedFilter}
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary2
            title={'This Week'}
            percent={currentWeekStats?.growth || 0}
            total={currentWeekStats?.total_tickets || 0}
            color="secondary"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={monthTicketData}
            totalTickets={currentWeekStats?.total_tickets || 0}
            totalOpen={currentWeekStats?.total_open || 0}
            totalInProgress={currentWeekStats?.total_in_progress || 0}
            totalClosed={currentWeekStats?.total_closed || 0}
            totalSold={currentWeekStats?.total_sold || 0}
            growth={currentWeekStats?.growth || 0}
            preTitle="Previous Week"
            preTotalTickets={previousWeekStats?.total_tickets || 0}
            preTotalOpen={previousWeekStats?.total_open || 0}
            preTotalInProgress={previousWeekStats?.total_in_progress || 0}
            preTotalClosed={previousWeekStats?.total_closed || 0}
            preTotalSold={previousWeekStats?.total_sold || 0}
          />
        </Grid>

        <Grid xs={12} sm={6} md={4}>
          <AnalyticsWidgetSummary2
            title={'This Month'}
            percent={currentMonthStats?.growth || 0}
            total={currentWeekStats?.total_tickets || 0}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={monthTicketData}
            totalTickets={currentMonthStats?.total_tickets || 0}
            totalOpen={currentMonthStats?.total_open || 0}
            totalInProgress={currentMonthStats?.total_in_progress || 0}
            totalClosed={currentMonthStats?.total_closed || 0}
            totalSold={currentMonthStats?.total_sold || 0}
            growth={currentMonthStats?.growth || 0}
            preTitle="Previous Month"
            preTotalTickets={previousMonthStats?.total_tickets || 0}
            preTotalOpen={previousMonthStats?.total_open || 0}
            preTotalInProgress={previousMonthStats?.total_in_progress || 0}
            preTotalClosed={previousMonthStats?.total_closed || 0}
            preTotalSold={previousMonthStats?.total_sold || 0}
          />
        </Grid> */}
<Grid xs={12} sm={6} md={4}>
          <BlankWidget />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <BlankWidget />
        </Grid>

       
        
    
{/* 
        <Grid xs={12} md={6} lg={8}>
          <AnalyticsConversionRates
            title="Conversion rates"
            subheader="(+43%) than last year"
            chart={{
              categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
              series: [
                { name: '2022', data: [44, 55, 41, 64, 22] },
                { name: '2023', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsCurrentSubject
            title="Current subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

        <Grid xs={12} md={6} lg={8}>
          <AnalyticsEscalation
            title="Escalation Details"
            list={escalationList.length ? escalationList.slice(0, 5) : []}
            // list={escalationList?.slice(0, 5) || []}
            //  list={Array.isArray(escalationList) ? escalationList.slice(0, 5) : []}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AnalyticsTrafficBySite
            title="Traffic by site"
            list={[
              { value: 'facebook', label: 'Facebook', total: 323234 },
              { value: 'google', label: 'Google', total: 341212 },
              { value: 'linkedin', label: 'Linkedin', total: 411213 },
              { value: 'twitter', label: 'Twitter', total: 443232 },
            ]}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={8}>
          <AnalyticsTasks title="Tasks" list={_tasks} />
        </Grid> */}
      </Grid>
    </DashboardContent>
  );
}
