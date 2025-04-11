'use client'

import { useState } from 'react'
import { useSupabase } from '@/hooks/useSupabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Loader2, Database, FolderPlus, Check } from 'lucide-react'

export default function AdminStoragePage() {
  const { supabase, user } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [buckets, setBuckets] = useState<any[]>([])
  const [newBucket, setNewBucket] = useState({
    name: 'avatars',
    public: true,
    fileSizeLimit: 5
  })
  const [bucketLoaded, setBucketLoaded] = useState(false)

  // Load buckets when component mounts
  const loadBuckets = async () => {
    if (!supabase) return
    
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.storage.listBuckets()
      
      if (error) throw error
      
      setBuckets(data || [])
      setBucketLoaded(true)
    } catch (err: any) {
      console.error('Failed to load buckets:', err)
      setError(err.message || 'Failed to load storage buckets')
    } finally {
      setLoading(false)
    }
  }

  // Create a new storage bucket
  const createBucket = async () => {
    if (!supabase) return
    
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { error } = await supabase.storage.createBucket(newBucket.name, {
        public: newBucket.public,
        fileSizeLimit: newBucket.fileSizeLimit * 1024 * 1024 // Convert MB to bytes
      })
      
      if (error) throw error
      
      setSuccess(`Bucket '${newBucket.name}' created successfully!`)
      
      // Reload buckets
      await loadBuckets()
    } catch (err: any) {
      console.error('Failed to create bucket:', err)
      setError(err.message || 'Failed to create storage bucket')
    } finally {
      setLoading(false)
    }
  }

  // Check if avatars bucket exists
  const avatarsBucketExists = bucketLoaded && buckets.some(bucket => bucket.name === 'avatars')

  // Create the default avatars bucket using the API route
  const createAvatarsBucket = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Call the API route to create the bucket using server-side service role
      const response = await fetch('/api/storage/create-bucket')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create bucket')
      }
      
      if (data.bucketExists) {
        setSuccess("Avatars bucket already exists. Policies have been updated!")
      } else {
        setSuccess("Avatars bucket and access policies created successfully!")
      }
      
      // Reload buckets
      await loadBuckets()
    } catch (err: any) {
      console.error('Failed to create avatars bucket:', err)
      setError(err.message || 'Failed to create avatars bucket')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Storage Management</h1>
        <Button 
          variant="outline" 
          onClick={loadBuckets}
          disabled={loading}
        >
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
          Refresh Buckets
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create Avatar Storage</CardTitle>
            <CardDescription>
              Create the default 'avatars' bucket required for profile photos
            </CardDescription>
          </CardHeader>
          <CardContent>
            {avatarsBucketExists ? (
              <div className="flex items-center p-4 text-emerald-700 bg-emerald-50 rounded-lg">
                <Check className="mr-2 h-5 w-5" />
                <span>
                  The 'avatars' bucket already exists. Profile photo upload should be working.
                </span>
              </div>
            ) : (
              <p className="text-amber-700">
                The 'avatars' bucket does not exist. This is required for profile photo uploads to work.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={createAvatarsBucket}
              disabled={loading || avatarsBucketExists}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Avatars Bucket
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Bucket</CardTitle>
            <CardDescription>Create a custom storage bucket</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="bucket-name">Bucket Name</Label>
                <Input
                  id="bucket-name"
                  value={newBucket.name}
                  onChange={(e) => setNewBucket({ ...newBucket, name: e.target.value })}
                  placeholder="e.g., avatars, documents, images"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="public-bucket">Public Bucket</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow public access to files in this bucket
                  </p>
                </div>
                <Switch
                  id="public-bucket"
                  checked={newBucket.public}
                  onCheckedChange={(checked) => setNewBucket({ ...newBucket, public: checked })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="size-limit">File Size Limit (MB)</Label>
                <Input
                  id="size-limit"
                  type="number"
                  min="1"
                  max="50"
                  value={newBucket.fileSizeLimit}
                  onChange={(e) => setNewBucket({ ...newBucket, fileSizeLimit: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={createBucket}
              disabled={loading || !newBucket.name}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create Bucket
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {bucketLoaded && buckets.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Existing Buckets</h2>
          <div className="bg-white rounded-md shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Public</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {buckets.map((bucket) => (
                  <tr key={bucket.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bucket.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bucket.public ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bucket.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
} 