'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Calendar, DollarSign, AlertCircle, TrendingUp, ArrowRight } from 'lucide-react';

const appointmentData = [
  { month: 'Jan', appointments: 45 },
  { month: 'Feb', appointments: 52 },
  { month: 'Mar', appointments: 48 },
  { month: 'Apr', appointments: 61 },
  { month: 'May', appointments: 55 },
  { month: 'Jun', appointments: 67 },
];

const revenueData = [
  { month: 'Jan', revenue: 8900 },
  { month: 'Feb', revenue: 9200 },
  { month: 'Mar', revenue: 8500 },
  { month: 'Apr', revenue: 10200 },
  { month: 'May', revenue: 9800 },
  { month: 'Jun', revenue: 11000 },
];

const patientDistribution = [
  { name: 'Active', value: 245 },
  { name: 'Inactive', value: 89 },
  { name: 'New', value: 56 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

const stats = [
  {
    icon: Users,
    label: 'Total Patients',
    value: '390',
    change: '+12.5%',
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
    href: '/patients',
  },
  {
    icon: Calendar,
    label: 'Total Appointments',
    value: '328',
    change: '+8.2%',
    color: 'bg-green-100',
    textColor: 'text-green-600',
    href: '/appointments',
  },
  {
    icon: DollarSign,
    label: 'Total Revenue',
    value: '$57,500',
    change: '+15.3%',
    color: 'bg-purple-100',
    textColor: 'text-purple-600',
    href: '/billing',
  },
  {
    icon: AlertCircle,
    label: 'Pending Bills',
    value: '24',
    change: '-4.1%',
    color: 'bg-red-100',
    textColor: 'text-red-600',
    href: '/billing',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your Hospital Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            target="_blank"
            rel="noreferrer"
            className="group block transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            <Card className="cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-2">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color} transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 group-hover:text-blue-600">
                  <span>Open in new tab</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Appointments Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Patient Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={patientDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {patientDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">New patient registered</p>
                  <p className="text-gray-500 text-xs">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">Appointment completed</p>
                  <p className="text-gray-500 text-xs">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pb-3 border-b">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">Payment received</p>
                  <p className="text-gray-500 text-xs">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium">Prescription issued</p>
                  <p className="text-gray-500 text-xs">2 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
