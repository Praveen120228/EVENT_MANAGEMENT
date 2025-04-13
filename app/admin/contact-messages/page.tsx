"use client"

import { useState, useEffect, useCallback } from "react"
import { AdminLayout } from "@/components/admin/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  Clock, 
  MailOpen, 
  AlertCircle,
  MoreHorizontal 
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSupabase } from "@/hooks/useSupabase"
import { DataTable, type Column } from "@/components/ui/data-table"

type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'in-progress' | 'resolved' | 'spam'
  created_at: string
  updated_at: string | null
}

export default function ContactMessagesPage() {
  const { supabase } = useSupabase()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('new')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const { toast } = useToast()

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (activeTab !== 'all') {
        query = query.eq('status', activeTab)
      }
      
      const { data, error } = await query
      
      if (error) {
        throw error
      }
      
      setMessages(data as ContactMessage[] || [])
    } catch (error) {
      console.error('Error loading contact messages:', error)
      toast({
        title: "Error",
        description: "Failed to load contact messages",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [supabase, activeTab, toast])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])
  
  const updateMessageStatus = useCallback(async (id: string, status: 'new' | 'in-progress' | 'resolved' | 'spam') => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        
      if (error) {
        throw error
      }
      
      setMessages(prevMessages => prevMessages.map(message => 
        message.id === id ? { ...message, status, updated_at: new Date().toISOString() } : message
      ))
      
      toast({
        title: "Status Updated",
        description: `Message marked as ${status}`,
      })
    } catch (error) {
      console.error('Error updating message status:', error)
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      })
    }
  }, [supabase, toast])

  const deleteMessage = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)
        
      if (error) {
        throw error
      }
      
      setMessages(prevMessages => prevMessages.filter(message => message.id !== id))
      
      toast({
        title: "Message Deleted",
        description: "The message has been permanently deleted",
      })
    } catch (error) {
      console.error('Error deleting message:', error)
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      })
    }
  }, [supabase, toast])

  const openMessageDetails = useCallback((message: ContactMessage) => {
    setSelectedMessage(message)
    setOpenDialog(true)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Clock className="h-4 w-4" />
      case 'in-progress':
        return <MailOpen className="h-4 w-4" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />
      case 'spam':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'spam':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const columns: Column<ContactMessage>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row?.status || 'new'
        return (
          <Badge className={getStatusColor(status)}>
            <span className="flex items-center gap-1">
              {getStatusIcon(status)}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Received",
      cell: ({ row }) => {
        if (!row?.created_at) return <span>N/A</span>
        
        try {
          const date = new Date(row.created_at)
          return <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
        } catch (error) {
          return <span>Invalid date</span>
        }
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        if (!row?.id) return null
        
        return (
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openMessageDetails(row as ContactMessage)}
            >
              View
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => updateMessageStatus(row.id, 'new')}>
                  Mark as New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateMessageStatus(row.id, 'in-progress')}>
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateMessageStatus(row.id, 'resolved')}>
                  Mark as Resolved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateMessageStatus(row.id, 'spam')}>
                  Mark as Spam
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={() => deleteMessage(row.id)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  return (
    <AdminLayout title="Contact Messages" description="Manage website contact form submissions">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
            <TabsTrigger value="spam">Spam</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <TabsContent value={activeTab} className="mt-6">
            <DataTable
              columns={columns}
              data={messages}
              loading={loading}
              emptyMessage="No contact messages found"
              searchPlaceholder="Search messages..."
              searchColumn="email"
            />
          </TabsContent>
        </Tabs>

        {selectedMessage && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Message from {selectedMessage.name}</DialogTitle>
                <DialogDescription>
                  Received on {new Date(selectedMessage.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <span className="font-medium text-gray-500">From:</span>
                  <span>{selectedMessage.name} ({selectedMessage.email})</span>
                  
                  <span className="font-medium text-gray-500">Subject:</span>
                  <span className="font-medium">{selectedMessage.subject}</span>
                  
                  <span className="font-medium text-gray-500">Status:</span>
                  <Badge className={getStatusColor(selectedMessage.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedMessage.status)}
                      {selectedMessage.status.charAt(0).toUpperCase() + selectedMessage.status.slice(1)}
                    </span>
                  </Badge>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-gray-500 mb-2">Message:</h4>
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 mt-4 border-t">
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        updateMessageStatus(selectedMessage.id, 'resolved')
                        setOpenDialog(false)
                      }}
                    >
                      Mark Resolved
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => {
                        updateMessageStatus(selectedMessage.id, 'spam')
                        setOpenDialog(false)
                      }}
                    >
                      Mark as Spam
                    </Button>
                  </div>
                  <Button 
                    variant="default"
                    onClick={() => {
                      window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`
                    }}
                  >
                    Reply via Email
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  )
} 