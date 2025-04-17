'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

// Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 10H9V3H3V10ZM3 17H9V11H3V17ZM10 17H16V10H10V17ZM10 3V9H16V3H10Z" fill="currentColor"/>
  </svg>
);

const EventsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.8333 3.33333H15V2.5H13.3333V3.33333H6.66667V2.5H5V3.33333H4.16667C3.24167 3.33333 2.5 4.08333 2.5 5V16.6667C2.5 17.5833 3.24167 18.3333 4.16667 18.3333H15.8333C16.75 18.3333 17.5 17.5833 17.5 16.6667V5C17.5 4.08333 16.75 3.33333 15.8333 3.33333ZM15.8333 16.6667H4.16667V7.5H15.8333V16.6667ZM5.83333 9.16667H10V13.3333H5.83333V9.16667Z" fill="currentColor"/>
  </svg>
);

const GuestsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.6083 11.8417C14.4667 10.7917 15 9.45833 15 8C15 4.68333 12.3167 2 9 2C5.68333 2 3 4.68333 3 8C3 11.3167 5.68333 14 9 14H17V12H15.8333C15.0917 12 14.3 11.8333 13.6083 11.8417ZM9 12C6.79167 12 5 10.2083 5 8C5 5.79167 6.79167 4 9 4C11.2083 4 13 5.79167 13 8C13 10.2083 11.2083 12 9 12ZM13.4 16.55L11.65 14.8L10.35 16.1L13.4 19.15L18.15 14.4L16.85 13.1L13.4 16.55Z" fill="currentColor"/>
  </svg>
);

const GalleryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 5V15C2.5 16.375 3.625 17.5 5 17.5H15C16.375 17.5 17.5 16.375 17.5 15V5C17.5 3.625 16.375 2.5 15 2.5H5C3.625 2.5 2.5 3.625 2.5 5ZM10.9167 12.0833L8.16667 10L4.16667 15H15.8333L10.9167 12.0833Z" fill="currentColor"/>
  </svg>
);

const CommunicationsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.6667 5.83333V14.1667C16.6667 15.275 15.775 16.1667 14.6667 16.1667H5.33333C4.225 16.1667 3.33333 15.275 3.33333 14.1667V5.83333C3.33333 4.725 4.225 3.83333 5.33333 3.83333H14.6667C15.775 3.83333 16.6667 4.725 16.6667 5.83333ZM8.75 10.8333L10.1667 12.25L11.25 11.1667L14.1667 14.1667H5.33333L8.75 10.8333Z" fill="currentColor"/>
  </svg>
);

const AnalyticsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 15.8333V9.16667H3.33333V15.8333H5ZM10.8333 15.8333V4.16667H9.16667V15.8333H10.8333ZM16.6667 15.8333V10.8333C16.6667 10.375 16.2917 10 15.8333 10H14.1667V15.8333H16.6667ZM18.3333 17.5H1.66667V18.3333H18.3333V17.5ZM1.66667 2.5V1.66667H18.3333V2.5H1.66667Z" fill="currentColor"/>
  </svg>
);

const ReportsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 1.66667C5.41667 1.66667 1.66667 5.41667 1.66667 10C1.66667 14.5833 5.41667 18.3333 10 18.3333C14.5833 18.3333 18.3333 14.5833 18.3333 10C18.3333 5.41667 14.5833 1.66667 10 1.66667ZM14.1667 13.3333H5.83333V11.6667H14.1667V13.3333ZM14.1667 10.8333H5.83333V9.16667H14.1667V10.8333ZM14.1667 8.33333H5.83333V6.66667H14.1667V8.33333Z" fill="currentColor"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.8333 3.33333H4.16667C3.24167 3.33333 2.5 4.08333 2.5 5V15C2.5 15.9167 3.25 16.6667 4.16667 16.6667H15.8333C16.75 16.6667 17.5 15.9167 17.5 15V5C17.5 4.08333 16.75 3.33333 15.8333 3.33333ZM10.8333 13.3333H5V11.6667H10.8333V13.3333ZM15 10H5V8.33333H15V10ZM15 6.66667H5V5H15V6.66667Z" fill="currentColor"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.917 9.667H10.25L10.0003 9.42866C10.8367 8.46532 11.3337 7.16999 11.3337 5.74999C11.3337 2.67499 8.84203 0.166656 5.75036 0.166656C2.65869 0.166656 0.166992 2.67499 0.166992 5.74999C0.166992 8.82499 2.65869 11.3333 5.75036 11.3333C7.15869 11.3333 8.45869 10.8333 9.42536 10L9.66703 10.25V10.9167L13.8337 15.075L15.0837 13.825L10.917 9.667ZM5.75036 9.66666C3.60036 9.66666 1.83369 7.89999 1.83369 5.74999C1.83369 3.59999 3.60036 1.83332 5.75036 1.83332C7.90036 1.83332 9.66703 3.59999 9.66703 5.74999C9.66703 7.89999 7.90036 9.66666 5.75036 9.66666Z" fill="#6B7280"/>
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18.3333C11.0833 18.3333 11.9167 17.5 11.9167 16.4167H8.08334C8.08334 17.5 8.90834 18.3333 10 18.3333ZM15.75 13.25V8.83333C15.75 5.99167 14.1833 3.65 11.5 3.06667V2.5C11.5 1.58333 10.75 0.833333 9.83334 0.833333C8.91667 0.833333 8.16667 1.58333 8.16667 2.5V3.06667C5.50834 3.65 3.95 5.98333 3.95 8.83333V13.25L2.03334 15.1667V16.1667H17.9667V15.1667L15.75 13.25Z" fill="#6B7280"/>
  </svg>
);

const UpTrendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 3.33334L8 12.6667M8 3.33334L12 7.33334M8 3.33334L4 7.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
    <line x1="8" y1="3" x2="8" y2="21" stroke="white" strokeWidth="2"/>
    <line x1="16" y1="3" x2="16" y2="21" stroke="white" strokeWidth="2"/>
    <line x1="3" y1="9" x2="21" y2="9" stroke="white" strokeWidth="2"/>
    <line x1="3" y1="15" x2="21" y2="15" stroke="white" strokeWidth="2"/>
  </svg>
);

const StatsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 4H5C3.89 4 3 4.9 3 6V20C3 21.1 3.89 22 5 22H19C20.11 22 21 21.1 21 20V6C21 4.9 20.11 4 19 4ZM19 20H5V10H19V20ZM9 14H7V19H9V14ZM13 12H11V19H13V12ZM17 8H15V19H17V8Z" fill="currentColor"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 13H13V18H11V13H6V11H11V6H13V11H18V13Z" fill="currentColor"/>
  </svg>
);

// Navigation item interface
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  href: string;
}

// Navigation item component
const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false, href }) => {
  return (
    <Link href={href} className={`flex items-center py-3 px-5 transition-all ${isActive ? 'bg-opacity-10 bg-white text-white border-l-3 border-white' : 'text-white/80 hover:bg-white/5'}`}>
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

// Stat card interface
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
}

// Stat card component
const StatCard: React.FC<StatCardProps> = ({ icon, title, value, trend }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 flex items-center border border-gray-200">
      <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center mr-4 text-emerald-500">
        {icon}
      </div>
      <div>
        <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className="flex items-center text-xs text-emerald-600 mt-1">
          <UpTrendIcon />
          <span className="ml-1">{trend}</span>
        </div>
      </div>
    </div>
  );
};

// Event status badge interface
interface StatusBadgeProps {
  status: 'active' | 'planning' | 'completed';
  label: string;
}

// Event status badge component
const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const bgColor = {
    active: 'bg-emerald-50 text-emerald-700',
    planning: 'bg-amber-50 text-amber-700',
    completed: 'bg-gray-50 text-gray-700'
  }[status];
  
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${bgColor}`}>
      {label}
    </span>
  );
};

// Activity item interface
interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
}

// Activity item component
const ActivityItem: React.FC<ActivityItemProps> = ({ title, description, time }) => {
  return (
    <div className="py-3 px-5 flex relative">
      <div className="w-3 h-3 rounded-full bg-emerald-500 mt-1 mr-4 flex-shrink-0"></div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-800 mb-1">{title}</h4>
        <p className="text-xs text-gray-500 mb-0.5">{description}</p>
        <div className="text-xs text-gray-400">{time}</div>
      </div>
    </div>
  );
};

// Main dashboard component
export default function CustomDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      {/* Top Bar */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-72">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search..." 
            className="border-none bg-transparent ml-2 flex-1 text-sm outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative cursor-pointer">
            <NotificationIcon />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
              3
            </div>
          </div>
          
          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium cursor-pointer">
            RM
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="p-6 bg-gray-50">
        {/* Hero Banner with Dashboard Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Your Event Dashboard</h1>
              <p className="text-gray-600 mb-4">Manage all your events, guests, and analytics in one place with our powerful tools.</p>
              <Link href="/dashboard/create">
                <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Event
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="/images/features/dashboard-hero-emerald.svg" 
                  alt="Event Management Dashboard" 
                  className="w-full h-auto"
                  onError={(e) => {
                    console.error('Error loading primary image');
                    // Try the first fallback
                    (e.target as HTMLImageElement).src = '/images/features/event-management-emerald.svg';
                    
                    // Add a second error handler for the first fallback
                    (e.target as HTMLImageElement).onerror = () => {
                      console.error('Error loading first fallback image');
                      // Try the second fallback
                      (e.target as HTMLImageElement).src = '/images/features/dashboard-emerald.svg';
                      
                      // Add a third error handler for the second fallback
                      (e.target as HTMLImageElement).onerror = () => {
                        console.error('Error loading second fallback image');
                        // Set an inline SVG as last resort
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%2310b981"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle">Specyf Event Management</text></svg>';
                      };
                    };
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={<StatsIcon />}
            title="Total Events" 
            value="24" 
            trend="12% this month" 
          />
          <StatCard 
            icon={<UsersIcon />}
            title="Total Attendees" 
            value="1,248" 
            trend="9% this month" 
          />
          <StatCard 
            icon={<PlusIcon />}
            title="Response Rate" 
            value="89%" 
            trend="4% this month" 
          />
        </div>
        
        {/* Events and Activity */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-800">Upcoming Events</h2>
              <div className="text-sm text-emerald-600 font-medium cursor-pointer">View All</div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Event Name</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Location</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Attendees</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="px-5 py-4 text-sm text-gray-800">Annual Conference 2023</td>
                    <td className="px-5 py-4 text-sm text-gray-800">Jun 15, 2023</td>
                    <td className="px-5 py-4 text-sm text-gray-800">New York, NY</td>
                    <td className="px-5 py-4 text-sm text-gray-800">245 / 300</td>
                    <td className="px-5 py-4">
                      <StatusBadge status="active" label="Active" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-5 py-4 text-sm text-gray-800">Product Launch</td>
                    <td className="px-5 py-4 text-sm text-gray-800">Jul 10, 2023</td>
                    <td className="px-5 py-4 text-sm text-gray-800">Online</td>
                    <td className="px-5 py-4 text-sm text-gray-800">178 / 500</td>
                    <td className="px-5 py-4">
                      <StatusBadge status="active" label="Active" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="px-5 py-4 text-sm text-gray-800">Team Building Workshop</td>
                    <td className="px-5 py-4 text-sm text-gray-800">Aug 5, 2023</td>
                    <td className="px-5 py-4 text-sm text-gray-800">Chicago, IL</td>
                    <td className="px-5 py-4 text-sm text-gray-800">65 / 100</td>
                    <td className="px-5 py-4">
                      <StatusBadge status="planning" label="Planning" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-4 text-sm text-gray-800">Customer Appreciation Day</td>
                    <td className="px-5 py-4 text-sm text-gray-800">Aug 22, 2023</td>
                    <td className="px-5 py-4 text-sm text-gray-800">Miami, FL</td>
                    <td className="px-5 py-4 text-sm text-gray-800">92 / 150</td>
                    <td className="px-5 py-4">
                      <StatusBadge status="planning" label="Planning" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-800">Recent Activity</h2>
            </div>
            
            <div>
              <ActivityItem 
                title="New registration" 
                description="Annual Conference" 
                time="10 minutes ago" 
              />
              <ActivityItem 
                title="Email campaign sent" 
                description="Product Launch" 
                time="2 hours ago" 
              />
              <ActivityItem 
                title="Event created" 
                description="Team Building Workshop" 
                time="1 day ago" 
              />
              <ActivityItem 
                title="Poll results updated" 
                description="Annual Conference" 
                time="2 days ago" 
              />
              <ActivityItem 
                title="New venue confirmed" 
                description="Customer Appreciation Day" 
                time="3 days ago" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 