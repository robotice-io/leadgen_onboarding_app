"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Users, Clock, Mail, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Email {
  uuid: string;
  subject: string;
  recipient: string;
  sent_at: string;
  opens: number;
  unique_devices: number;
  status: "sent" | "delivered" | "opened" | "clicked";
}

interface RecentEmailsProps {
  emails: Email[];
}

// Mock data if no emails provided
const mockEmails: Email[] = [
  {
    uuid: "1",
    subject: "Summer Sale - 50% Off Everything!",
    recipient: "john@example.com",
    sent_at: "2025-01-10T15:30:00Z",
    opens: 3,
    unique_devices: 2,
    status: "opened"
  },
  {
    uuid: "2", 
    subject: "Welcome to Robotice LeadGen",
    recipient: "sarah@company.com",
    sent_at: "2025-01-10T14:15:00Z",
    opens: 1,
    unique_devices: 1,
    status: "opened"
  },
  {
    uuid: "3",
    subject: "Your Monthly Newsletter",
    recipient: "mike@startup.io",
    sent_at: "2025-01-10T13:45:00Z",
    opens: 0,
    unique_devices: 0,
    status: "delivered"
  },
  {
    uuid: "4",
    subject: "Product Launch Announcement",
    recipient: "lisa@tech.com",
    sent_at: "2025-01-10T12:20:00Z",
    opens: 5,
    unique_devices: 3,
    status: "clicked"
  },
  {
    uuid: "5",
    subject: "Follow-up: Demo Request",
    recipient: "alex@business.net",
    sent_at: "2025-01-10T11:10:00Z",
    opens: 2,
    unique_devices: 1,
    status: "opened"
  }
];

export function RecentEmails({ emails = mockEmails }: RecentEmailsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Ensure emails is an array to prevent filter errors
  const safeEmails = Array.isArray(emails) ? emails : mockEmails;

  const filteredEmails = safeEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || email.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
      case "delivered": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "opened": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "clicked": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Emails
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Latest email activity and performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="sent">Sent</option>
              <option value="delivered">Delivered</option>
              <option value="opened">Opened</option>
              <option value="clicked">Clicked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredEmails.length === 0 ? (
          <div className="p-8 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No emails found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Start sending emails to see them here"
              }
            </p>
          </div>
        ) : (
          filteredEmails.map((email) => (
            <div key={email.uuid} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {email.subject}
                    </h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(email.status)}`}>
                      {email.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {email.recipient}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {formatDate(email.sent_at)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 ml-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                      <Eye className="h-4 w-4" />
                      {email.opens}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Opens</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                      <Users className="h-4 w-4" />
                      {email.unique_devices}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Devices</div>
                  </div>
                  
                  <Link 
                    href={`/dashboard/email/${email.uuid}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {filteredEmails.length > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredEmails.length} of {emails.length} emails
            </p>
            <Button variant="outline" className="h-9 px-3 text-sm">
              View All Emails
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
