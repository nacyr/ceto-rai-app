'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'
import { supabase } from '@/app/lib/supabase'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Heart,
  Clock,
  Eye,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card'
import { Button } from '@/app/components/ui/button'
import { Badge } from '@/app/components/ui/badge'

interface ReportTemplate {
  id: string
  title: string
  description: string
  type: 'donation' | 'volunteer' | 'impact' | 'comprehensive'
  icon: any
  format: 'pdf' | 'csv' | 'excel'
  lastGenerated?: string
  size?: string
}

interface GeneratedReport {
  id: string
  title: string
  type: string
  generatedAt: string
  format: string
  size: string
  downloadUrl: string
}

export default function ReportsPage() {
  const { user } = useAuth()
  const [reports, setReports] = useState<GeneratedReport[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('all')

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'donation-summary',
      title: 'Donation Summary Report',
      description: 'Complete overview of all your donations, amounts, and programs supported',
      type: 'donation',
      icon: Heart,
      format: 'pdf',
      lastGenerated: '2024-01-15',
      size: '2.3 MB'
    },
    {
      id: 'volunteer-activity',
      title: 'Volunteer Activity Report',
      description: 'Summary of volunteer applications, hours, and activities participated',
      type: 'volunteer',
      icon: Users,
      format: 'pdf',
      lastGenerated: '2024-01-10',
      size: '1.8 MB'
    },
    {
      id: 'impact-analysis',
      title: 'Personal Impact Analysis',
      description: 'Detailed analysis of your impact across all programs and initiatives',
      type: 'impact',
      icon: TrendingUp,
      format: 'pdf',
      size: '3.1 MB'
    },
    {
      id: 'donation-history-csv',
      title: 'Donation History (CSV)',
      description: 'Raw data export of all donations for personal record keeping',
      type: 'donation',
      icon: BarChart3,
      format: 'csv',
      size: '0.5 MB'
    },
    {
      id: 'tax-summary',
      title: 'Tax Deduction Summary',
      description: 'Annual summary for tax deduction purposes with all necessary details',
      type: 'donation',
      icon: FileText,
      format: 'pdf',
      size: '1.2 MB'
    },
    {
      id: 'comprehensive-report',
      title: 'Comprehensive Activity Report',
      description: 'Complete overview including donations, volunteering, and impact metrics',
      type: 'comprehensive',
      icon: PieChart,
      format: 'pdf',
      size: '4.5 MB'
    }
  ]

  useEffect(() => {
    if (user) {
      fetchReports()
    }
  }, [user])

  const fetchReports = async () => {
    try {
      setLoading(true)
      
      // Mock generated reports data
      const mockReports: GeneratedReport[] = [
        {
          id: '1',
          title: 'Donation Summary Report - January 2024',
          type: 'donation',
          generatedAt: '2024-01-15T10:30:00Z',
          format: 'pdf',
          size: '2.3 MB',
          downloadUrl: '#'
        },
        {
          id: '2',
          title: 'Volunteer Activity Report - Q4 2023',
          type: 'volunteer',
          generatedAt: '2024-01-10T14:20:00Z',
          format: 'pdf',
          size: '1.8 MB',
          downloadUrl: '#'
        },
        {
          id: '3',
          title: 'Donation History Export',
          type: 'donation',
          generatedAt: '2024-01-05T09:15:00Z',
          format: 'csv',
          size: '0.5 MB',
          downloadUrl: '#'
        }
      ]
      
      setReports(mockReports)
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = async (templateId: string) => {
    setGenerating(templateId)
    
    // Simulate report generation
    setTimeout(() => {
      const template = reportTemplates.find(t => t.id === templateId)
      if (template) {
        const newReport: GeneratedReport = {
          id: Date.now().toString(),
          title: `${template.title} - ${new Date().toLocaleDateString()}`,
          type: template.type,
          generatedAt: new Date().toISOString(),
          format: template.format,
          size: template.size || '1.0 MB',
          downloadUrl: '#'
        }
        setReports(prev => [newReport, ...prev])
      }
      setGenerating(null)
    }, 3000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'donation':
        return 'bg-green-100 text-green-800'
      case 'volunteer':
        return 'bg-blue-100 text-blue-800'
      case 'impact':
        return 'bg-purple-100 text-purple-800'
      case 'comprehensive':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and download reports about your activities and impact</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Time</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="ytd">Year to Date</option>
          </select>
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Report Templates */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <template.icon className="w-5 h-5 text-teal-600" />
                  <span className="text-lg">{template.title}</span>
                </CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={getTypeColor(template.type)}>
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </Badge>
                  <span className="text-sm text-gray-500 uppercase">{template.format}</span>
                </div>
                
                {template.lastGenerated && (
                  <p className="text-sm text-gray-500 mb-4">
                    Last generated: {template.lastGenerated}
                  </p>
                )}

                <Button
                  onClick={() => generateReport(template.id)}
                  disabled={generating === template.id}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                >
                  {generating === template.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Reports</h2>
        <Card>
          <CardHeader>
            <CardTitle>Downloaded Reports</CardTitle>
            <CardDescription>
              Your previously generated reports are available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reports generated yet</p>
                <p className="text-sm text-gray-400">Generate your first report using the templates above</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <FileText className="w-8 h-8 text-teal-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(report.generatedAt)}</span>
                          </span>
                          <Badge className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                          <span className="uppercase">{report.format}</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Total reports created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Generated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {reports.length > 0 ? 'Today' : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              {reports.length > 0 ? formatDate(reports[0].generatedAt) : 'No reports yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {reports.reduce((total, report) => {
                const size = parseFloat(report.size.split(' ')[0])
                return total + size
              }, 0).toFixed(1)} MB
            </div>
            <p className="text-xs text-muted-foreground">Total file size</p>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Learn more about our reporting features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Report Types</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Donation Reports:</strong> Track your giving history and tax deductions</li>
                <li>• <strong>Volunteer Reports:</strong> Monitor your volunteer activities and hours</li>
                <li>• <strong>Impact Reports:</strong> See the difference you're making</li>
                <li>• <strong>Comprehensive:</strong> Complete overview of all activities</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">File Formats</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>PDF:</strong> Professional reports for sharing and printing</li>
                <li>• <strong>CSV:</strong> Raw data for spreadsheet analysis</li>
                <li>• <strong>Excel:</strong> Formatted spreadsheets with charts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}