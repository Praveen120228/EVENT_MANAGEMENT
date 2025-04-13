import React from "react"

interface AdminLayoutProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function AdminLayout({ title, description, children }: AdminLayoutProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-gray-500 mt-2">{description}</p>}
      </div>
      {children}
    </div>
  )
} 