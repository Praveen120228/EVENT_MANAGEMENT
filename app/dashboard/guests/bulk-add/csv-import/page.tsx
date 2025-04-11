'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Loader2, ArrowLeft, FileUp, Download } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface ParsedGuest {
  name: string;
  email: string;
  status?: string;
  [key: string]: string | undefined;
}

export default function ImportCsvPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [parseError, setParseError] = useState<string | null>(null)
  const [parsedData, setParsedData] = useState<ParsedGuest[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParseError(null)
    setParsedData([])
    
    const file = e.target.files?.[0]
    if (!file) return
    
    // Check file type
    if (!file.name.endsWith('.csv')) {
      setParseError('Please upload a valid CSV file')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        setFileContent(content)
        
        // Parse CSV
        const lines = content.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
        
        // Validate required headers
        const requiredHeaders = ['name', 'email']
        const missingHeaders = requiredHeaders.filter(h => 
          !headers.map(header => header.toLowerCase()).includes(h)
        )
        
        if (missingHeaders.length > 0) {
          setParseError(`Missing required headers: ${missingHeaders.join(', ')}`)
          return
        }
        
        // Parse data rows
        const data = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim())
            const row = headers.reduce((obj, header, index) => {
              obj[header.toLowerCase()] = values[index] || ''
              return obj
            }, {} as Record<string, string>)
            
            // Ensure required properties exist
            return row as ParsedGuest
          })
          .filter(row => row.name && row.email) // Filter rows with name and email
        
        setParsedData(data)
      } catch (err) {
        console.error('Error parsing CSV:', err)
        setParseError('Error parsing CSV file. Please check the format.')
      }
    }
    
    reader.readAsText(file)
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer?.files?.[0]
    if (!file) return
    
    // Update file input to reflect the dropped file
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputRef.current.files = dataTransfer.files
      
      // Trigger onChange manually
      const event = new Event('change', { bubbles: true })
      fileInputRef.current.dispatchEvent(event)
    }
  }
  
  const downloadTemplate = () => {
    const template = 'Name,Email,Status\nJohn Doe,john@example.com,confirmed\nJane Smith,jane@example.com,pending'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guest-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const continueToImport = () => {
    if (!fileContent || parsedData.length === 0) return
    
    // Format the data as expected by the bulk add page
    const formattedData = parsedData.map(row => {
      return `${row.name}, ${row.email}${row.status ? `, ${row.status}` : ''}`
    }).join('\n')
    
    // Store in localStorage for the bulk add page to use
    localStorage.setItem('bulkAddInput', formattedData)
    router.push('/dashboard/guests/bulk-add')
  }
  
  if (authLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
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
        <h1 className="text-2xl font-bold">Import Guests from CSV</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
        </CardHeader>
        <CardContent>
          {parseError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{parseError}</AlertDescription>
            </Alert>
          )}
          
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={downloadTemplate}
              className="mb-4"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <FileUp className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-700 mb-1">Drag and drop your CSV file here</p>
              <p className="text-gray-500 text-sm">or click to browse</p>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".csv" 
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              The CSV should have at minimum <code>Name</code> and <code>Email</code> columns. 
              <code>Status</code> is optional.
            </p>
          </div>
          
          {parsedData.length > 0 && (
            <>
              <Separator className="my-4" />
              
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Preview</h3>
                <p className="text-sm text-gray-500 mb-2">Found {parsedData.length} guests in the CSV file.</p>
                
                <div className="max-h-60 overflow-y-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(parsedData[0]).map(header => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parsedData.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((value, j) => (
                            <td key={j} className="px-6 py-4 whitespace-nowrap text-sm">
                              {value || '-'}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {parsedData.length > 5 && (
                        <tr>
                          <td colSpan={Object.keys(parsedData[0]).length} className="px-6 py-4 text-center text-sm text-gray-500">
                            + {parsedData.length - 5} more rows
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={continueToImport}>
                  Continue to Import
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 