'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  Trash2, 
  AlertTriangle, 
  MailOpen, 
  CalendarCheck, 
  Check, 
  X, 
  ExternalLink,
  Search,
  Mail
} from 'lucide-react';
import { fetchDemoRequests, updateDemoRequestStatus, deleteDemoRequest, DemoRequest } from '@/lib/admin-utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export default function DemoRequestsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<DemoRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<DemoRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDemoRequests();
  }, []);

  // Apply filters whenever demoRequests, statusFilter, or searchQuery changes
  useEffect(() => {
    filterRequests();
  }, [demoRequests, statusFilter, searchQuery]);

  async function loadDemoRequests() {
    setLoading(true);
    setError(null);
    
    const { data, error } = await fetchDemoRequests();
    
    if (error) {
      setError(error);
    } else {
      setDemoRequests(data || []);
    }
    
    setLoading(false);
  }

  function filterRequests() {
    let filtered = [...demoRequests];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.name.toLowerCase().includes(query) ||
        request.email.toLowerCase().includes(query) ||
        (request.company && request.company.toLowerCase().includes(query)) ||
        (request.event_type && request.event_type.toLowerCase().includes(query))
      );
    }
    
    setFilteredRequests(filtered);
  }

  async function handleStatusChange(id: string, status: DemoRequest['status']) {
    setStatusUpdating(id);
    
    const { data, error } = await updateDemoRequestStatus(id, status);
    
    if (error) {
      setError(error);
    } else if (data) {
      setDemoRequests(prev => 
        prev.map(request => 
          request.id === id ? data : request
        )
      );
    }
    
    setStatusUpdating(null);
  }

  async function handleDeleteRequest() {
    if (!requestToDelete) return;
    
    const { success, error } = await deleteDemoRequest(requestToDelete.id);
    
    if (error) {
      setError(error);
    } else if (success) {
      setDemoRequests(prev => 
        prev.filter(request => request.id !== requestToDelete.id)
      );
    }
    
    setRequestToDelete(null);
    setDeleteDialogOpen(false);
  }

  function openDeleteDialog(request: DemoRequest) {
    setRequestToDelete(request);
    setDeleteDialogOpen(true);
  }

  // Helper function to render status badge
  function renderStatusBadge(status: DemoRequest['status']) {
    const statusConfig = {
      new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
      contacted: { color: 'bg-yellow-100 text-yellow-800', label: 'Contacted' },
      scheduled: { color: 'bg-purple-100 text-purple-800', label: 'Scheduled' },
      completed: { color: 'bg-emerald-100 text-emerald-800', label: 'Completed' },
      declined: { color: 'bg-gray-100 text-gray-800', label: 'Declined' }
    };
    
    const config = statusConfig[status];
    
    return (
      <Badge className={`${config.color} font-medium`}>
        {config.label}
      </Badge>
    );
  }

  // Calculate statistics
  const stats = demoRequests.reduce((acc, request) => {
    acc.total++;
    acc[request.status]++;
    return acc;
  }, {
    total: 0,
    new: 0,
    contacted: 0,
    scheduled: 0,
    completed: 0,
    declined: 0
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Demo Requests Management</h1>

      {error && (
        <Alert className="mb-6 bg-red-50 text-red-800 border-red-100">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-700">{stats.new}</div>
            <div className="text-sm text-blue-600">New</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-700">{stats.contacted}</div>
            <div className="text-sm text-yellow-600">Contacted</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-700">{stats.scheduled}</div>
            <div className="text-sm text-purple-600">Scheduled</div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-emerald-700">{stats.completed}</div>
            <div className="text-sm text-emerald-600">Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-100">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-gray-700">{stats.declined}</div>
            <div className="text-sm text-gray-600">Declined</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Manage Demo Requests</CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  className="pl-9 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {demoRequests.length === 0 
                ? "No demo requests found." 
                : "No requests match your filters."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Name</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Email</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Company</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Event Type</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Status</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map(request => (
                    <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{request.name}</td>
                      <td className="py-3 px-4">{request.email}</td>
                      <td className="py-3 px-4">{request.company || '-'}</td>
                      <td className="py-3 px-4">{request.event_type || '-'}</td>
                      <td className="py-3 px-4">
                        {format(new Date(request.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 px-4">
                        {renderStatusBadge(request.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Select
                            value={request.status}
                            onValueChange={(value) => 
                              handleStatusChange(
                                request.id, 
                                value as DemoRequest['status']
                              )
                            }
                            disabled={statusUpdating === request.id}
                          >
                            <SelectTrigger className="w-[140px]">
                              {statusUpdating === request.id ? (
                                <div className="flex items-center">
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Updating...
                                </div>
                              ) : (
                                <SelectValue placeholder="Change status" />
                              )}
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">
                                <div className="flex items-center">
                                  <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                                  New
                                </div>
                              </SelectItem>
                              <SelectItem value="contacted">
                                <div className="flex items-center">
                                  <MailOpen className="h-4 w-4 mr-2 text-yellow-500" />
                                  Contacted
                                </div>
                              </SelectItem>
                              <SelectItem value="scheduled">
                                <div className="flex items-center">
                                  <CalendarCheck className="h-4 w-4 mr-2 text-purple-500" />
                                  Scheduled
                                </div>
                              </SelectItem>
                              <SelectItem value="completed">
                                <div className="flex items-center">
                                  <Check className="h-4 w-4 mr-2 text-emerald-500" />
                                  Completed
                                </div>
                              </SelectItem>
                              <SelectItem value="declined">
                                <div className="flex items-center">
                                  <X className="h-4 w-4 mr-2 text-gray-500" />
                                  Declined
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Link href={`/admin/demo-requests/${request.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              title="View details"
                            >
                              <ExternalLink className="h-4 w-4 text-blue-500" />
                            </Button>
                          </Link>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteDialog(request)}
                            title="Delete request"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                          
                          <a 
                            href={`mailto:${request.email}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              title="Send email"
                            >
                              <Mail className="h-4 w-4 text-gray-500" />
                            </Button>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Demo Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the demo request from {requestToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteRequest}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 