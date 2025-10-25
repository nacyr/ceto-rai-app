/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { 
  Download, 
  FileText, 
  Users, 
  DollarSign, 
  UserCheck,
  FileSpreadsheet,
  FileJson,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Badge } from '@/app/components/ui/badge'
import { Input } from '@/app/components/ui/input'
import { ExportJob, ExportOptions } from '@/app/types/admin/types'
import { supabase } from '@/lib/supabaseClient'


export function ExportManager() {
  const [activeTab, setActiveTab] = useState<'donations' | 'volunteers' | 'users'>('donations')
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0] // today
    },
    filters: {},
    includeFields: []
  })
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [isExporting, setIsExporting] = useState(false)

  const exportConfigs = {
    donations: {
      title: 'Donations Export',
      description: 'Export donation records with donor information and transaction details',
      icon: DollarSign,
      fields: [
        { id: 'donor_name', label: 'Donor Name', default: true },
        { id: 'donor_email', label: 'Donor Email', default: true },
        { id: 'amount', label: 'Amount', default: true },
        { id: 'currency', label: 'Currency', default: true },
        { id: 'program', label: 'Program', default: true },
        { id: 'status', label: 'Status', default: true },
        { id: 'payment_method', label: 'Payment Method', default: false },
        { id: 'transaction_id', label: 'Transaction ID', default: false },
        { id: 'created_at', label: 'Date Created', default: true },
        { id: 'updated_at', label: 'Date Updated', default: false },
        { id: 'notes', label: 'Notes', default: false }
      ],
      filters: [
        { id: 'status', label: 'Status', type: 'select', options: ['completed', 'pending', 'failed'] },
        { id: 'program', label: 'Program', type: 'select', options: ['Education', 'Healthcare', 'Environment', 'Community'] },
        { id: 'min_amount', label: 'Minimum Amount', type: 'number' },
        { id: 'max_amount', label: 'Maximum Amount', type: 'number' }
      ]
    },
    volunteers: {
      title: 'Volunteers Export',
      description: 'Export volunteer applications and profiles with skills and status information',
      icon: Users,
      fields: [
        { id: 'full_name', label: 'Full Name', default: true },
        { id: 'email', label: 'Email', default: true },
        { id: 'phone', label: 'Phone', default: true },
        { id: 'skills', label: 'Skills', default: true },
        { id: 'status', label: 'Status', default: true },
        { id: 'availability', label: 'Availability', default: false },
        { id: 'experience', label: 'Experience', default: false },
        { id: 'motivation', label: 'Motivation', default: false },
        { id: 'background_check', label: 'Background Check', default: false },
        { id: 'created_at', label: 'Application Date', default: true },
        { id: 'approved_at', label: 'Approval Date', default: false }
      ],
      filters: [
        { id: 'status', label: 'Status', type: 'select', options: ['pending', 'approved', 'rejected'] },
        { id: 'skills', label: 'Skills', type: 'multiselect', options: ['Teaching', 'Healthcare', 'Technology', 'Administration', 'Fundraising'] },
        { id: 'availability', label: 'Availability', type: 'select', options: ['weekdays', 'weekends', 'evenings', 'flexible'] }
      ]
    },
    users: {
      title: 'Users Export',
      description: 'Export user profiles and account information',
      icon: UserCheck,
      fields: [
        { id: 'full_name', label: 'Full Name', default: true },
        { id: 'email', label: 'Email', default: true },
        { id: 'role', label: 'Role', default: true },
        { id: 'status', label: 'Status', default: true },
        { id: 'phone', label: 'Phone', default: false },
        { id: 'address', label: 'Address', default: false },
        { id: 'date_of_birth', label: 'Date of Birth', default: false },
        { id: 'created_at', label: 'Registration Date', default: true },
        { id: 'last_login', label: 'Last Login', default: false },
        { id: 'email_verified', label: 'Email Verified', default: true }
      ],
      filters: [
        { id: 'role', label: 'Role', type: 'select', options: ['user', 'volunteer', 'admin'] },
        { id: 'status', label: 'Status', type: 'select', options: ['active', 'inactive', 'suspended'] },
        { id: 'email_verified', label: 'Email Verified', type: 'select', options: ['true', 'false'] }
      ]
    }
  }

  const handleFieldToggle = (fieldId: string) => {
    setExportOptions(prev => ({
      ...prev,
      includeFields: prev.includeFields.includes(fieldId)
        ? prev.includeFields.filter(id => id !== fieldId)
        : [...prev.includeFields, fieldId]
    }))
  }

  // const handleFilterChange = (filterId: string, value: any) => {
  const handleFilterChange = (filterId: string, value: string | number | string[]) => {
    setExportOptions(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterId]: value
      }
    }))
  }

  const generateExportData = async (type: string) => {
    let query = supabase.from(type) as any

    // Apply date range filter
    if (exportOptions.dateRange.start && exportOptions.dateRange.end) {
      query = query
        .gte('created_at', exportOptions.dateRange.start)
        .lte('created_at', exportOptions.dateRange.end)
    }

    // Apply status filter
    if (exportOptions.filters.status) {
      query = query.eq('status', exportOptions.filters.status)
    }

    // Apply program filter for donations
    if (type === 'donations' && exportOptions.filters.program) {
      query = query.eq('program', exportOptions.filters.program)
    }

    const { data, error } = await query.select('*')
    
    if (error) throw error
    return data || []
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return

    const config = exportConfigs[activeTab]
    const selectedFields = exportOptions.includeFields.length > 0 
      ? exportOptions.includeFields 
      : config.fields.filter(f => f.default).map(f => f.id)

    // Create CSV headers
    const headers = selectedFields.map(fieldId => {
      const field = config.fields.find(f => f.id === fieldId)
      return field?.label || fieldId
    })

    // Create CSV rows
    const rows = data.map(item => 
      selectedFields.map(fieldId => {
        let value = item[fieldId]
        if (Array.isArray(value)) {
          value = value.join('; ')
        }
        if (typeof value === 'object' && value !== null) {
          value = JSON.stringify(value)
        }
        return `"${String(value || '').replace(/"/g, '""')}"`
      })
    )

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // const exportToJSON = (data: any[], filename: string) => {
  const exportToJSON = (data: Record<string, unknown>[], filename: string) => {
    const config = exportConfigs[activeTab]
    const selectedFields = exportOptions.includeFields.length > 0 
      ? exportOptions.includeFields 
      : config.fields.filter(f => f.default).map(f => f.id)

    // Filter data to include only selected fields
    const filteredData = data.map(item => {
      const filtered: any = {}
      selectedFields.forEach(fieldId => {
        filtered[fieldId] = item[fieldId]
      })
      return filtered
    })

    const jsonContent = JSON.stringify(filteredData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExport = async () => {
    setIsExporting(true)
    
    const jobId = `export_${Date.now()}`
    const newJob: ExportJob = {
      id: jobId,
      type: activeTab,
      status: 'processing',
      progress: 0,
      createdAt: new Date()
    }

    setExportJobs(prev => [newJob, ...prev])

    try {
      // Simulate progress updates
      const updateProgress = (progress: number) => {
        setExportJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, progress } : job
        ))
      }

      updateProgress(25)
      
      // Fetch data
      const data = await generateExportData(activeTab)
      updateProgress(50)

      if (data.length === 0) {
        throw new Error('No data found for the selected criteria')
      }

      updateProgress(75)

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${activeTab}_export_${timestamp}.${exportOptions.format}`

      // Export based on format
      if (exportOptions.format === 'csv') {
        exportToCSV(data, filename)
      } else if (exportOptions.format === 'json') {
        exportToJSON(data, filename)
      }

      updateProgress(100)

      // Mark job as completed
      setExportJobs(prev => prev.map(job => 
        job.id === jobId ? { 
          ...job, 
          status: 'completed', 
          completedAt: new Date(),
          recordCount: data.length
        } : job
      ))

    } catch (error) {
      console.error('Export error:', error)
      setExportJobs(prev => prev.map(job => 
        job.id === jobId ? { 
          ...job, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Export failed'
        } : job
      ))
    } finally {
      setIsExporting(false)
    }
  }

  const config = exportConfigs[activeTab]
  const Icon = config.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center">
        <Download className="h-6 w-6 text-gray-600 mr-2" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Export Manager</h2>
          <p className="text-gray-600">Export data for analysis and reporting</p>
        </div>
      </div>

      {/* Export Type Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {Object.entries(exportConfigs).map(([key, config]) => {
          const TabIcon = config.icon
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TabIcon className="h-4 w-4 mr-2" />
              {config.title}
            </button>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Export Configuration */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Icon className="h-5 w-5 mr-2" />
                {config.title}
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
                    { value: 'json', label: 'JSON', icon: FileJson }
                  ].map(({ value, label, icon: FormatIcon }) => (
                    <button
                      key={value}
                      onClick={() => setExportOptions(prev => ({ ...prev, format: value as any }))}
                      className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                        exportOptions.format === value
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <FormatIcon className="h-4 w-4 mr-2" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <Input
                      type="date"
                      value={exportOptions.dateRange.start}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, start: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <Input
                      type="date"
                      value={exportOptions.dateRange.end}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, end: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filters
                </label>
                <div className="grid gap-4 md:grid-cols-2">
                  {config.filters.map(filter => (
                    <div key={filter.id}>
                      <label className="block text-xs text-gray-500 mb-1">{filter.label}</label>
                      {filter.type === 'select' && (
                        <select
                          value={exportOptions.filters[filter.id] || ''}
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value="">All</option>
                          {filter.options?.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      )}
                      {filter.type === 'number' && (
                        <Input
                          type="number"
                          placeholder={`Enter ${filter.label.toLowerCase()}`}
                          value={exportOptions.filters[filter.id] || ''}
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Field Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fields to Include
                </label>
                <div className="grid gap-2 md:grid-cols-2">
                  {config.fields.map(field => (
                    <label key={field.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions.includeFields.length === 0 
                          ? field.default 
                          : exportOptions.includeFields.includes(field.id)
                        }
                        onChange={() => handleFieldToggle(field.id)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{field.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Export Button */}
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export {config.title}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Export History */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Export History
              </CardTitle>
              <CardDescription>Recent export jobs and downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {exportJobs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No exports yet
                  </p>
                ) : (
                  exportJobs.slice(0, 10).map(job => (
                    <div key={job.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {job.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
                          {job.status === 'failed' && <AlertCircle className="h-4 w-4 text-red-600 mr-2" />}
                          {job.status === 'processing' && <Loader2 className="h-4 w-4 text-blue-600 mr-2 animate-spin" />}
                          <span className="text-sm font-medium capitalize">{job.type}</span>
                        </div>
                        <Badge 
                          variant={job.status === 'completed' ? 'default' : 
                                  job.status === 'failed' ? 'destructive' : 'secondary'}
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {job.createdAt.toLocaleString()}
                      </div>
                      {job.recordCount && (
                        <div className="text-xs text-gray-600 mt-1">
                          {job.recordCount} records exported
                        </div>
                      )}
                      {job.error && (
                        <div className="text-xs text-red-600 mt-1">
                          {job.error}
                        </div>
                      )}
                      {job.status === 'processing' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{job.progress}% complete</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}