'use client';
import SafeImage from '@/app/components/SafeImage';
import { apiRequest } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Bell, Clock, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Notification {
  id: string;
  title: string;
  body: string;
  slug?:string;
  image_url: string;
  created_at: string;
}

// API functions
const fetchNotifications = async (): Promise<Notification[]> => {
  try {
    const response: any = await apiRequest('notifications', { method: 'GET' });
    console.log('response', response);
    return Array.isArray(response) ? response : response?.data || [];
  } catch {
    return [];
  }
};

const formatTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  } catch {
    return 'Unknown time';
  }
};

const NotificationsScreen: React.FC = () => {
  const router=useRouter();
  const {
    data: notifications = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    refetchOnWindowFocus: true,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load notifications</h3>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'Something went wrong while fetching your notifications.'}
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="hidden md:block  bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="hidden md:flex items-center justify-between">
            <div className=" flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-sm text-gray-500">
                  Stay updated with your latest notifications
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh notifications"
            >
              <RefreshCw className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              When you receive notifications, they'll appear here. Check back later for updates!
            </p>
          </div>
        ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
  {notifications.map((notification) => (
    <div
      key={notification.id}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* Top Banner / Image */}
      <div className="w-full h-40 bg-gray-100">
        <SafeImage
          src={notification.image_url}
          alt="notification"
          width="200"
          height="300"
          className="w-full h-full object-fill"
        />
      </div>

      {/* Middle Content */}
      <div className="flex px-4 py-2 pb-0 items-center flex-1 gap-3">
        {/* Left Icon */}
        <div className="flex-shrink-0 self-start">
          <div className="p-2 bg-pink-100 rounded-full">
            <Bell className="w-5 h-5 text-pink-600" />
          </div>
        </div>

        {/* Right Content */}
        <div className="flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
            {notification.title}
          </h3>
          <p className="text-sm text-gray-600  mb-1">
            {notification.body}
          </p>
          <p className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {formatTimeAgo(notification.created_at)}
          </p>
        </div>
      </div>

      { notification.slug &&
      <div className="border-t px-3 py-2 border-gray-100">
        <button
          onClick={() => router.push('/collection/'+notification.slug)}
          className="w-full text-center py-2 text-sm font-medium text-pink-600 border border-pink-300 rounded-lg hover:bg-pink-50 transition"
        >
          Shop Now
        </button>
      </div>}
    </div>
  ))}
</div>


        )}
      </div>
    </div>
  );
};

export default NotificationsScreen;