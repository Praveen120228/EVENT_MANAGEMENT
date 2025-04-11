'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft, FileUp, Download, FileText, FileJson, Table as TableIcon, AlertCircle, Info } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ParsedGuest {
  name: string;
  email: string;
  status?: string;
  message?: string;
  [key: string]: string | undefined;
}

interface FileFormatInfo {
  icon: React.ReactNode;
  title: string;
  description: string;
  template: string;
}

const fileFormats: Record<string, FileFormatInfo> = {
  csv: {
    icon: <FileText className="h-8 w-8 text-blue-500" />,
    title: "CSV File",
    description: "Comma-separated values file. Most spreadsheet programs can export this format.",
    template: 'Name,Email,Status,Message\nJohn Doe,john@example.com,confirmed,Looking forward to it\nJane Smith,jane@example.com,pending,'
  },
  excel: {
    icon: <TableIcon className="h-8 w-8 text-green-600" />,
    title: "Excel File",
    description: "Microsoft Excel spreadsheet (.xlsx). Must have Name and Email columns.",
    template: ''
  },
  json: {
    icon: <FileJson className="h-8 w-8 text-amber-500" />,
    title: "JSON File",
    description: "JSON array of guest objects with name and email properties.",
    template: '[\n  {\n    "name": "John Doe",\n    "email": "john@example.com",\n    "status": "confirmed",\n    "message": "Looking forward to it"\n  },\n  {\n    "name": "Jane Smith",\n    "email": "jane@example.com",\n    "status": "pending"\n  }\n]'
  }
};

export default function FileImportPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<ParsedGuest[]>([])
  const [selectedFormat, setSelectedFormat] = useState<string>('csv')
  const [processing, setProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])
  
  const validateGuests = (guests: any[]): { valid: ParsedGuest[], invalid: any[], errors: string[] } => {
    const valid: ParsedGuest[] = [];
    const invalid: any[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < guests.length; i++) {
      const guest = guests[i];
      const rowNum = i + 1;
      
      // Check required fields
      if (!guest.name || typeof guest.name !== 'string') {
        errors.push(`Row ${rowNum}: Missing or invalid name`);
        invalid.push(guest);
        continue;
      }
      
      if (!guest.email || typeof guest.email !== 'string') {
        errors.push(`Row ${rowNum}: Missing or invalid email`);
        invalid.push(guest);
        continue;
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guest.email)) {
        errors.push(`Row ${rowNum}: Invalid email format - ${guest.email}`);
        invalid.push(guest);
        continue;
      }
      
      // Validate status if provided
      if (guest.status && !['pending', 'confirmed', 'declined'].includes(guest.status)) {
        errors.push(`Row ${rowNum}: Invalid status "${guest.status}" (must be pending, confirmed, or declined)`);
        invalid.push(guest);
        continue;
      }
      
      // Guest is valid
      valid.push({
        name: guest.name,
        email: guest.email,
        status: guest.status || 'pending',
        message: guest.message || undefined
      });
    }
    
    return { valid, invalid, errors };
  };
  
  const parseCSV = (content: string): ParsedGuest[] => {
    const lines = content.split('\n');
    if (lines.length < 2) throw new Error('File must contain at least a header row and one data row');
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Check required headers
    const nameIdx = headers.indexOf('name');
    const emailIdx = headers.indexOf('email');
    
    if (nameIdx === -1) throw new Error('CSV must contain a "Name" column');
    if (emailIdx === -1) throw new Error('CSV must contain an "Email" column');
    
    // Optional headers
    const statusIdx = headers.indexOf('status');
    const messageIdx = headers.indexOf('message');
    
    const guests = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      if (values.length < 2) continue;
      
      const guest: any = {
        name: values[nameIdx],
        email: values[emailIdx],
      };
      
      if (statusIdx !== -1 && values[statusIdx]) {
        guest.status = values[statusIdx];
      }
      
      if (messageIdx !== -1 && values[messageIdx]) {
        guest.message = values[messageIdx];
      }
      
      guests.push(guest);
    }
    
    return guests;
  };
  
  const parseJSON = (content: string): ParsedGuest[] => {
    const data = JSON.parse(content);
    
    if (!Array.isArray(data)) {
      throw new Error('JSON must contain an array of guest objects');
    }
    
    return data;
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseError(null);
    setParsedData([]);
    setProcessing(true);
    
    try {
      const file = e.target.files?.[0];
      if (!file) {
        setProcessing(false);
        return;
      }
      
      // Check file type
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      let format: string;
      
      if (fileExt === 'csv') {
        format = 'csv';
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        format = 'excel';
      } else if (fileExt === 'json') {
        format = 'json';
      } else {
        throw new Error(`Unsupported file type: .${fileExt}. Please upload a CSV, Excel, or JSON file.`);
      }
      
      setSelectedFormat(format);
      
      // Read file
      const content = await readFileContent(file, format);
      setFileContent(content);
      
      // Parse content based on format
      let guests: ParsedGuest[] = [];
      
      if (format === 'csv') {
        guests = parseCSV(content);
      } else if (format === 'excel') {
        throw new Error('Excel support coming soon. Please use CSV format for now.');
      } else if (format === 'json') {
        guests = parseJSON(content);
      }
      
      // Validate guests
      const validation = validateGuests(guests);
      
      if (validation.errors.length > 0) {
        setParseError(`Found ${validation.errors.length} validation issues. Please fix and try again.`);
        console.error('Validation errors:', validation.errors);
      }
      
      setParsedData(validation.valid);
    } catch (err) {
      console.error('Error parsing file:', err);
      setParseError(err instanceof Error ? err.message : 'Error parsing file');
    } finally {
      setProcessing(false);
    }
  };
  
  const readFileContent = (file: File, format: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          resolve(content);
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    
    // Update file input to reflect the dropped file
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      
      // Trigger onChange manually
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };
  
  const downloadTemplate = (format: string) => {
    const formatInfo = fileFormats[format];
    if (!formatInfo || !formatInfo.template) return;
    
    const fileExtension = format;
    const fileName = `guest-template.${fileExtension}`;
    const mimeType = format === 'csv' ? 'text/csv' : format === 'json' ? 'application/json' : 'text/plain';
    
    const blob = new Blob([formatInfo.template], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const continueToImport = () => {
    if (!fileContent || parsedData.length === 0) return;
    
    // Format the data as expected by the bulk add page
    const formattedData = parsedData.map(guest => {
      let line = `${guest.name}, ${guest.email}`;
      if (guest.status && guest.status !== 'pending') {
        line += `, ${guest.status}`;
      }
      return line;
    }).join('\n');
    
    // Store in localStorage for the bulk add page to use
    localStorage.setItem('bulkAddInput', formattedData);
    router.push('/dashboard/guests/bulk-add');
  };
  
  if (authLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Import Guests from Files</h1>
      </div>
      
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="formats">Supported Formats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Upload Guest List File</CardTitle>
              <CardDescription>
                Import guests from CSV, Excel, or JSON files
              </CardDescription>
            </CardHeader>
            <CardContent>
              {parseError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{parseError}</AlertDescription>
                </Alert>
              )}
              
              <div className="mb-6">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {processing ? (
                    <Loader2 className="h-10 w-10 mx-auto text-gray-400 mb-2 animate-spin" />
                  ) : (
                    <FileUp className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  )}
                  <p className="text-gray-700 mb-1">Drag and drop your file here</p>
                  <p className="text-gray-500 text-sm">or click to browse</p>
                  <p className="text-gray-500 text-xs mt-2">Supports CSV, Excel, and JSON files</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".csv,.xlsx,.xls,.json" 
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={processing}
                  />
                </div>
                
                <div className="flex mt-4 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadTemplate('csv')}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    CSV Template
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadTemplate('json')}
                    className="text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    JSON Template
                  </Button>
                </div>
              </div>
              
              {parsedData.length > 0 && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">Preview</h3>
                      <Badge variant="outline">
                        {parsedData.length} valid guests
                      </Badge>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Message</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parsedData.slice(0, 5).map((guest, i) => (
                            <TableRow key={i}>
                              <TableCell>{guest.name}</TableCell>
                              <TableCell>{guest.email}</TableCell>
                              <TableCell>
                                <Badge className={
                                  guest.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 
                                  guest.status === 'declined' ? 'bg-red-100 text-red-800' : 
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {guest.status || 'pending'}
                                </Badge>
                              </TableCell>
                              <TableCell>{guest.message || '-'}</TableCell>
                            </TableRow>
                          ))}
                          {parsedData.length > 5 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center text-sm text-gray-500">
                                + {parsedData.length - 5} more guests
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <Alert className="mb-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Next Step</AlertTitle>
                    <AlertDescription>
                      Click continue to select which events to add these guests to.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="flex justify-end">
                    <Button onClick={continueToImport}>
                      Continue to Add Guests
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="formats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Object.entries(fileFormats).map(([format, info]) => (
              <Card key={format}>
                <CardHeader>
                  <div className="flex items-center mb-2">
                    {info.icon}
                    <CardTitle className="ml-2">{info.title}</CardTitle>
                  </div>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Required columns:</p>
                  <ul className="list-disc pl-5 text-sm mt-1 mb-3">
                    <li>Name</li>
                    <li>Email</li>
                  </ul>
                  
                  <p className="text-sm">Optional columns:</p>
                  <ul className="list-disc pl-5 text-sm mt-1">
                    <li>Status (pending, confirmed, declined)</li>
                    <li>Message</li>
                  </ul>
                  
                  {info.template && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-4 w-full"
                      onClick={() => downloadTemplate(format)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 