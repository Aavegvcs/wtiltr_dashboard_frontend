interface DashboardData {
  statistics: {
    daily: Array<{
      category: string;
      total_tickets: string;
      total_open: string;
      total_in_progress: string;
      total_closed: string;
      growth?: string | null;
    }>;
    weekly: Array<{
      category: string;
      total_tickets: string;
      total_open: string;
      total_in_progress: string;
      total_closed: string;
      growth?: string | null;
    }>;
    monthly: Array<{
      category: string;
      total_tickets: string;
      total_open: string;
      total_in_progress: string;
      total_closed: string;
    }>;
  };
}

type TicketStats = {
  category: string;
  total_tickets: number;
  total_open: number;
  total_in_progress: number;
  total_closed: number;
  growth?: number; // only present in 'today' or 'this_week' types
  total_sold: number;
};



type InsuranceTypeKey = 'HEALTH' | 'LIFE' | 'MOTOR' | 'OTHER'; // extend this if needed

type InsuranceGrowthStats = {
  current_year: string;
  previous_year: string;
  growth: string;
};

type TotalSold = {
  total_current_year: number;
  total_previous_year: number;
  total_growth: string;
} & Record<InsuranceTypeKey, InsuranceGrowthStats>;


