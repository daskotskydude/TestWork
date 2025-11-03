'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TopNav } from '@/components/layout/TopNav'

export default function PreviewPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <main className="container py-8 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Component Gallery</h1>
          <p className="text-muted-foreground">
            Phase B UI Components - Built with Tailwind CSS + shadcn/ui
          </p>
        </div>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Buttons</h2>
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>All button styles and sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🔍</Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button onClick={() => setCount(count + 1)}>
                  Clicked {count} times
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Badges</h2>
          <Card>
            <CardHeader>
              <CardTitle>Badge Variants</CardTitle>
              <CardDescription>Status indicators and tags</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Form Inputs */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Form Inputs</h2>
          <Card>
            <CardHeader>
              <CardTitle>Text Inputs</CardTitle>
              <CardDescription>Input and textarea components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email</label>
                <Input type="email" placeholder="john@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea placeholder="Enter detailed description..." rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Disabled Input</label>
                <Input disabled placeholder="Cannot edit this" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cards</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Simple Card</CardTitle>
                <CardDescription>Basic card layout</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">This is a simple card with header and content.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="success" className="w-fit mb-2">Active</Badge>
                <CardTitle>Card with Badge</CardTitle>
                <CardDescription>Status indicator in header</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Badges can be placed anywhere in the card.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>With button action</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Cards can contain any components.</p>
                <Button size="sm" className="w-full">Take Action</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Skeletons */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Loading States</h2>
          <Card>
            <CardHeader>
              <CardTitle>Skeleton Loaders</CardTitle>
              <CardDescription>Placeholders while content loads</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Color Palette */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
          <Card>
            <CardHeader>
              <CardTitle>Theme Colors</CardTitle>
              <CardDescription>Tailwind CSS custom colors used throughout the app</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="h-16 rounded-lg bg-primary mb-2"></div>
                  <p className="text-sm font-medium">Primary</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-secondary mb-2"></div>
                  <p className="text-sm font-medium">Secondary</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-destructive mb-2"></div>
                  <p className="text-sm font-medium">Destructive</p>
                </div>
                <div>
                  <div className="h-16 rounded-lg bg-accent mb-2"></div>
                  <p className="text-sm font-medium">Accent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Typography</h2>
          <Card>
            <CardHeader>
              <CardTitle>Text Styles</CardTitle>
              <CardDescription>Font sizes and weights</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <h3 className="text-2xl font-semibold">Heading 3</h3>
              <h4 className="text-xl font-medium">Heading 4</h4>
              <p className="text-base">Body text - regular paragraph with normal weight.</p>
              <p className="text-sm text-muted-foreground">Small text - often used for descriptions.</p>
              <p className="text-xs text-muted-foreground">Extra small text - captions and labels.</p>
            </CardContent>
          </Card>
        </section>

        {/* Coming Soon Badge */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Status Indicators</h2>
          <Card>
            <CardHeader>
              <CardTitle>Phase Status Badges</CardTitle>
              <CardDescription>Used throughout the app to show feature readiness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium">Component Gallery</span>
                  <Badge variant="success">✅ Complete (UI-only)</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium">Authentication</span>
                  <Badge variant="secondary">⏳ Coming Soon</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium">Live Data</span>
                  <Badge variant="warning">🟡 In Progress</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <span className="font-medium">Payments</span>
                  <Badge variant="outline">📋 Planned</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Info Panel */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📍 Phase B: UI Scaffold (Mock Data)
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            All components are functional with mock data. Phase C will wire Supabase for authentication 
            and live data persistence. Check{' '}
            <a href="/" className="underline font-medium">homepage</a>
            {' '}for build status.
          </p>
        </div>
      </main>
    </div>
  )
}
