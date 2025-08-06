"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, MapPin, Phone, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

interface FIRActivity {
  incidentId: string
  firNumber?: string
  status: 'draft' | 'submitted' | 'approved' | 'lodged'
  incidentDescription: string
  incidentLocation: string
  policeStation: {
    name: string
    address: string
    phone: string
    distance: number
  }
  timestamp: string
  submittedAt?: string
}

interface FIRActivityCardProps {
  fir: FIRActivity
}

export default function FIRActivityCard({ fir }: FIRActivityCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lodged': return 'bg-green-100 text-green-800 border-green-200'
      case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'lodged': return <CheckCircle className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'submitted': return <Clock className="h-4 w-4" />
      case 'draft': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-600" />
            FIR Activity
          </CardTitle>
          <Badge className={getStatusColor(fir.status)}>
            {getStatusIcon(fir.status)}
            <span className="ml-1 capitalize">{fir.status}</span>
          </Badge>
        </div>
        {fir.firNumber && (
          <p className="text-sm text-gray-600 font-mono">
            FIR Number: {fir.firNumber}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Incident Summary */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Incident Summary</h4>
          <p className="text-sm text-gray-600">
            {truncateText(fir.incidentDescription)}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-start space-x-2">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Location</p>
            <p className="text-sm text-gray-600">{fir.incidentLocation}</p>
          </div>
        </div>

        {/* Police Station */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Police Station</h4>
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-800">{fir.policeStation.name}</p>
            <p className="text-sm text-blue-700">{fir.policeStation.address}</p>
            <div className="flex items-center space-x-4 text-sm text-blue-700">
              <span>📞 {fir.policeStation.phone}</span>
              <span>📍 {fir.policeStation.distance} km away</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Created: {formatDate(fir.timestamp)}
            </span>
          </div>
          {fir.submittedAt && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600">
                Lodged: {formatDate(fir.submittedAt)}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(`tel:${fir.policeStation.phone}`, '_blank')}
          >
            <Phone className="h-4 w-4 mr-1" />
            Call Station
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(fir.policeStation.name + ' ' + fir.policeStation.address)}`
              window.open(mapsUrl, '_blank')
            }}
          >
            <MapPin className="h-4 w-4 mr-1" />
            Directions
          </Button>
        </div>

        {/* Status-specific information */}
        {fir.status === 'lodged' && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800">FIR Successfully Lodged</p>
                <p className="text-xs text-green-700">
                  Your complaint has been officially registered. Keep this FIR number for future reference.
                </p>
              </div>
            </div>
          </div>
        )}

        {fir.status === 'submitted' && (
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Under Review</p>
                <p className="text-xs text-yellow-700">
                  Your FIR is being reviewed by the police station. You may be contacted for additional information.
                </p>
              </div>
            </div>
          </div>
        )}

        {fir.status === 'draft' && (
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex items-start space-x-2">
              <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-800">Draft FIR</p>
                <p className="text-xs text-gray-700">
                  This is a draft FIR. Review and submit when ready to lodge the complaint.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 