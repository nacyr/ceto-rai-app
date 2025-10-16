import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Heart,
  Calendar,
  Award,
  Activity,
  PieChart,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Progress } from '@/app/components/ui/progress';

interface AnalyticsData {
  overview: {
    totalDonations: number;
    totalAmount: number;
    totalVolunteers: number;
    totalUsers: number;
    monthlyGrowth: number;
  };
  donationsByProgram: Array<{
    program: string;
    amount: number;
    count: number;
    percentage: number;
  }>;
  donationsTrend: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
  volunteerStats: {
    pending: number;
    approved: number;
    rejected: number;
    totalApplications: number;
  };
  topDonors: Array<{
    name: string;
    email: string;
    totalAmount: number;
    donationCount: number;
  }>;
  recentActivity: Array<{
    type: 'donation' | 'volunteer' | 'user';
    description: string;
    timestamp: string;
    amount?: number;
  }>;
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    overview: {
      totalDonations: 0,
      totalAmount: 0,
      totalVolunteers: 0,
      totalUsers: 0,
      monthlyGrowth: 0
    },
    donationsByProgram: [],
    donationsTrend: [],
    volunteerStats: {
      pending: 0,
      approved: 0,
      rejected: 0,
      totalApplications: 0
    },
    topDonors: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?timeframe=${timeframe}`);
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, description, icon: Icon, color, trend }: {
    title: string;
    value: string;
    description: string;
    icon: any;
    color: string;
    trend?: number;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{description}</span>
          {trend !== undefined && (
            <span className={`flex items-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into your organization's performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" onClick={fetchAnalyticsData}>
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Donations"
          value={formatCurrency(data.overview.totalAmount)}
          description={`${data.overview.totalDonations} donations`}
          icon={DollarSign}
          color="text-green-600"
          trend={data.overview.monthlyGrowth}
        />
        <StatCard
          title="Active Volunteers"
          value={data.overview.totalVolunteers.toString()}
          description="Approved volunteers"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Total Users"
          value={data.overview.totalUsers.toString()}
          description="Registered users"
          icon={Heart}
          color="text-purple-600"
        />
        <StatCard
          title="Volunteer Applications"
          value={data.volunteerStats.totalApplications.toString()}
          description={`${data.volunteerStats.pending} pending`}
          icon={Award}
          color="text-orange-600"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Donations by Program */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Donations by Program
            </CardTitle>
            <CardDescription>Distribution of donations across programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.donationsByProgram.map((program, index) => (
                <div key={program.program} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{program.program}</span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(program.amount)} ({program.percentage}%)
                    </span>
                  </div>
                  <Progress value={program.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Volunteer Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Volunteer Applications
            </CardTitle>
            <CardDescription>Current status of volunteer applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Approved</span>
                </div>
                <span className="font-medium">{data.volunteerStats.approved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Pending</span>
                </div>
                <span className="font-medium">{data.volunteerStats.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Rejected</span>
                </div>
                <span className="font-medium">{data.volunteerStats.rejected}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Donors and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Donors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Top Donors
            </CardTitle>
            <CardDescription>Most generous contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topDonors.slice(0, 5).map((donor, index) => (
                <div key={donor.email} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-teal-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{donor.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-500">{donor.donationCount} donations</p>
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(donor.totalAmount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentActivity.slice(0, 5).map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'donation' ? 'bg-green-500' :
                    activity.type === 'volunteer' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation Trend Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Donation Trends
          </CardTitle>
          <CardDescription>Monthly donation patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chart visualization will be implemented here</p>
              <p className="text-sm text-gray-400">Consider integrating Chart.js or Recharts</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}