'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, DatabaseIcon, CheckCircle, AlertCircle, SearchIcon, KeyIcon } from 'lucide-react'
import { 
  fixEventsProfilesRelationship, 
  fixSubEventsTable, 
  runDatabaseDiagnostics,
  fixEventsProfilesRelationshipWithServiceRole,
  fixSubEventsTableWithServiceRole 
} from '@/lib/db-fixes'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FixResult {
  success: boolean
  message: string
  error?: string
  details?: string
  needsAuth?: boolean
  [key: string]: any
}

export default function DatabaseFixer() {
  const [fixing, setFixing] = useState(false)
  const [diagnosing, setDiagnosing] = useState(false)
  const [result, setResult] = useState<FixResult | null>(null)
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null)
  const [adminToken, setAdminToken] = useState('')
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [fixType, setFixType] = useState<'profiles' | 'sub-events' | null>(null)

  const handleFixEventsProfiles = async () => {
    setFixing(true)
    setResult(null)
    
    try {
      const result = await fixEventsProfilesRelationship()
      
      // If it failed with permission issues, try with the server API
      if (!result.success && result.error?.includes('permission denied')) {
        setFixType('profiles')
        setShowAdminDialog(true)
        setFixing(false)
        return
      }
      
      setResult(result)
    } catch (err) {
      setResult({
        success: false,
        message: 'An unexpected error occurred',
        error: err instanceof Error ? err.message : 'Unknown error'
      })
    } finally {
      setFixing(false)
    }
  }
  
  const handleFixSubEvents = async () => {
    setFixing(true)
    setResult(null)
    
    try {
      const result = await fixSubEventsTable()
      
      // If it failed with permission issues, try with the server API
      if (!result.success && result.error?.includes('permission denied')) {
        setFixType('sub-events')
        setShowAdminDialog(true)
        setFixing(false)
        return
      }
      
      setResult(result)
    } catch (err) {
      setResult({
        success: false,
        message: 'An unexpected error occurred',
        error: err instanceof Error ? err.message : 'Unknown error'
      })
    } finally {
      setFixing(false)
    }
  }
  
  const handleRunDiagnostics = async () => {
    setDiagnosing(true)
    setDiagnosticResult(null)
    
    try {
      const result = await runDatabaseDiagnostics()
      setDiagnosticResult(result)
    } catch (err) {
      setDiagnosticResult({
        success: false,
        message: 'An unexpected error occurred during diagnostics',
        error: err instanceof Error ? err.message : 'Unknown error'
      })
    } finally {
      setDiagnosing(false)
    }
  }
  
  const handleAdminFix = async () => {
    setFixing(true)
    setShowAdminDialog(false)
    
    try {
      // Store token for future use
      if (adminToken) {
        localStorage.setItem('admin_token', adminToken)
      }
      
      let result
      
      if (fixType === 'profiles') {
        result = await fixEventsProfilesRelationshipWithServiceRole(adminToken)
      } else if (fixType === 'sub-events') {
        result = await fixSubEventsTableWithServiceRole(adminToken)
      } else {
        throw new Error('Unknown fix type')
      }
      
      // If it needs auth again, show the dialog
      if (result.needsAuth) {
        setShowAdminDialog(true)
        setResult({
          success: false,
          message: 'Admin authentication required',
          error: 'The token provided was not valid'
        })
        return
      }
      
      setResult(result)
    } catch (err) {
      setResult({
        success: false,
        message: 'An unexpected error occurred',
        error: err instanceof Error ? err.message : 'Unknown error'
      })
    } finally {
      setFixing(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <DatabaseIcon className="h-5 w-5 mr-2" />
            Database Troubleshooter
          </CardTitle>
          <CardDescription>
            Fix common database issues with your Specyf account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"} className={result.success ? "bg-emerald-50 text-emerald-800 border-emerald-100" : undefined}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {result.message}
                  {result.error && (
                    <div className="text-sm font-mono mt-2 bg-gray-100 p-2 rounded">
                      {result.error}
                    </div>
                  )}
                  {result.details && (
                    <div className="text-sm mt-2">
                      {result.details}
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
          
          <div className="space-y-2">
            <h3 className="font-medium">Fix Events-Profiles Relationship</h3>
            <p className="text-sm text-gray-500">
              If you're seeing errors about "Could not find a relationship between 'events' and 'profiles'", 
              this fix will re-establish the connection between your events and user profiles.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
          <Button
            onClick={handleRunDiagnostics}
            variant="outline"
            disabled={diagnosing}
          >
            {diagnosing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <SearchIcon className="h-4 w-4 mr-2" />}
            Run Diagnostics
          </Button>
          <Button
            onClick={handleFixSubEvents}
            variant="outline"
            disabled={fixing || diagnosing}
          >
            {fixing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Fix Sub-Events Issues
          </Button>
          <Button
            onClick={handleFixEventsProfiles}
            disabled={fixing || diagnosing}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {fixing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Fix Profiles Relationship
          </Button>
        </CardFooter>
      </Card>
      
      {diagnosticResult && (
        <Card className="w-full max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <SearchIcon className="h-5 w-5 mr-2" />
              Diagnostic Results
            </CardTitle>
            <CardDescription>
              Detailed analysis of your database structure
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Alert variant={diagnosticResult.success ? "default" : "destructive"} 
                  className={diagnosticResult.success ? "bg-emerald-50 text-emerald-800 border-emerald-100" : undefined}>
              <div className="flex items-center gap-2">
                {diagnosticResult.success ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {diagnosticResult.message}
                </AlertDescription>
              </div>
            </Alert>
            
            {!diagnosticResult.success && diagnosticResult.errors && diagnosticResult.errors.length > 0 && (
              <div className="text-sm font-medium mt-2">
                Issues found:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {diagnosticResult.errors.map((error: string, index: number) => (
                    <li key={index} className="text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tables">
                <AccordionTrigger>Table Status</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Profiles Table:</span>
                      <span className={diagnosticResult.profiles?.exists ? 'text-emerald-600' : 'text-red-600'}>
                        {diagnosticResult.profiles?.exists ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Events Table:</span>
                      <span className={diagnosticResult.events?.exists ? 'text-emerald-600' : 'text-red-600'}>
                        {diagnosticResult.events?.exists ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests Table:</span>
                      <span className={diagnosticResult.guests?.exists ? 'text-emerald-600' : 'text-red-600'}>
                        {diagnosticResult.guests?.exists ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sub Events Table:</span>
                      <span className={diagnosticResult.sub_events?.exists ? 'text-emerald-600' : 'text-red-600'}>
                        {diagnosticResult.sub_events?.exists ? 'Exists' : 'Missing'}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="relationships">
                <AccordionTrigger>Relationship Status</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Events to Profiles:</span>
                      <span className={diagnosticResult.joins?.eventsToProfiles ? 'text-emerald-600' : 'text-red-600'}>
                        {diagnosticResult.joins?.eventsToProfiles ? 'Working' : 'Broken'}
                      </span>
                    </div>
                    {diagnosticResult.joins?.errors?.eventsToProfiles && (
                      <div className="text-xs border-l-2 border-red-300 pl-2 py-1 mt-1 text-red-600">
                        {diagnosticResult.joins.errors.eventsToProfiles}
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Events to Guests:</span>
                      <span className={diagnosticResult.joins?.eventsToGuests ? 'text-emerald-600' : 'text-red-600'}>
                        {diagnosticResult.joins?.eventsToGuests ? 'Working' : 'Broken'}
                      </span>
                    </div>
                    {diagnosticResult.joins?.errors?.eventsToGuests && (
                      <div className="text-xs border-l-2 border-red-300 pl-2 py-1 mt-1 text-red-600">
                        {diagnosticResult.joins.errors.eventsToGuests}
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Events to Sub Events:</span>
                      <span className={diagnosticResult.joins?.eventsToSubEvents ? 'text-emerald-600' : 'text-red-600'}>
                        {diagnosticResult.joins?.eventsToSubEvents ? 'Working' : 'Broken'}
                      </span>
                    </div>
                    {diagnosticResult.joins?.errors?.eventsToSubEvents && (
                      <div className="text-xs border-l-2 border-red-300 pl-2 py-1 mt-1 text-red-600">
                        {diagnosticResult.joins.errors.eventsToSubEvents}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="policies">
                <AccordionTrigger>Security Policies</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Public Profiles Policy:</span>
                      <span className={diagnosticResult.policies?.publicProfilesReadable ? 'text-emerald-600' : 'text-red-600'}>
                        {diagnosticResult.policies?.publicProfilesReadable ? 'Working' : 'Missing/Broken'}
                      </span>
                    </div>
                    {diagnosticResult.policies?.errors?.publicProfiles && (
                      <div className="text-xs border-l-2 border-red-300 pl-2 py-1 mt-1 text-red-600">
                        {diagnosticResult.policies.errors.publicProfiles}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
      
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyIcon className="h-5 w-5" />
              Admin Authentication Required
            </DialogTitle>
            <DialogDescription>
              This database fix requires admin privileges. Enter your admin token below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adminToken" className="text-right">
                Admin Token
              </Label>
              <Input
                id="adminToken"
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Enter token"
                className="col-span-3"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              <p>To get an admin token, please contact your system administrator or add an ADMIN_API_TOKEN to your environment variables.</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAdminDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAdminFix}
              disabled={!adminToken || fixing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {fixing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Continue with Admin Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 