'use client'

import React from 'react'
import { EventsProfilesFixer } from '@/app/components/EventsProfilesFixer'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function DatabaseFixesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Database Fixes</h1>
      <p className="text-gray-600 mb-8">
        This page provides tools to fix common database relationship issues.
      </p>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Events-Profiles Relationship</h2>
          <EventsProfilesFixer />
        </section>
      </div>
    </div>
  )
} 