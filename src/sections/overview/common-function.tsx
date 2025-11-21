import { ColorType } from "src/theme/core";

export const getCardData = (dashboardData: DashboardData | null) => {
    if (!dashboardData || !dashboardData.statistics) return [];

    const { daily, weekly, monthly } = dashboardData.statistics;
  console.log('daily', daily);
    return [
      {
        title: 'Today’s Tickets',
        total: parseInt(daily.find((row) => row.category === 'today')?.total_tickets || '0', 10),
        percent: daily.find((row) => row.category === 'today')?.growth
          ? parseFloat(daily.find((row) => row.category === 'today')!.growth!)
          : 0,
        previousData: parseInt(daily.find((row) => row.category === 'yesterday')?.total_tickets || '0', 10),
        color: 'primary' as ColorType,
        icon: <img alt="icon" src="/assets/icons/glass/ic-glass-ticket.svg" />,
        chart: mockChartData,
      statistics: dashboardData.statistics,
      },
      {
        title: 'This Week’s Tickets',
        total: parseInt(weekly.find((row) => row.category === 'this_week')?.total_tickets || '0', 10),
        percent: weekly.find((row) => row.category === 'this_week')?.growth
          ? parseFloat(weekly.find((row) => row.category === 'this_week')!.growth!)
          : 0,
        previousData: parseInt(weekly.find((row) => row.category === 'previous_week')?.total_tickets || '0', 10),
        color: 'secondary' as ColorType,
        icon: <img alt="icon" src="/assets/icons/glass/ic-glass-calendar.svg" />,
        chart: mockChartData,
        statistics: dashboardData.statistics,
      },
      {
        title: 'This Month’s Tickets',
        total: parseInt(monthly.find((row) => row.category === '2025-05')?.total_tickets || '0', 10),
        percent: 0, // No growth provided for monthly
        previousData: {}, // No previous month data provided
        color: 'warning' as ColorType,
        icon: <img alt="icon" src="/assets/icons/glass/ic-glass-month.svg" />,
        chart: mockChartData,
        statistics: dashboardData.statistics,
      },
      {
        title: 'Total Open Tickets',
        total: parseInt(daily.find((row) => row.category === 'today')?.total_open || '0', 10),
        percent: 0, // No growth provided for open tickets
        previousData: parseInt(daily.find((row) => row.category === 'yesterday')?.total_open || '0', 10),
        color: 'error' as ColorType,
        icon: <img alt="icon" src="/assets/icons/glass/ic-glass-open-ticket.svg" />,
        chart: mockChartData,
        statistics: dashboardData.statistics,
      },
    ];
  };

    // Mock chart data (replace with actual data if available)
  const mockChartData = {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    series: [22, 8, 35, 50, 82, 84, 77, 12],
  };