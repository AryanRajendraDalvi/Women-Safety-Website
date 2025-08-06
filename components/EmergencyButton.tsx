"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, MapPin, Phone, Shield, Settings, X } from 'lucide-react'
import { toast } from 'sonner'

interface EmergencyContact {
  name: string
  phone: string
}

export default function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSetup, setShowSetup] = useState(false)
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])

  useEffect(() => {
    // Load saved emergency contacts
    const saved = localStorage.getItem('safespace_emergency_contacts')
    if (saved) {
      try {
        setEmergencyContacts(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading emergency contacts:', error)
      }
    }
  }, [])

  const saveEmergencyContacts = (contacts: EmergencyContact[]) => {
    localStorage.setItem('safespace_emergency_contacts', JSON.stringify(contacts))
    setEmergencyContacts(contacts)
  }

  const handleEmergency = async () => {
    setIsLoading(true)
    
    try {
      // Get user's location
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      
      // Create Google Maps link
      const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
      
      // Create WhatsApp message
      const message = encodeURIComponent(
        `🚨 EMERGENCY ALERT 🚨\n\nI need immediate help! I'm currently at this location:\n\n📍 ${mapsUrl}\n\nPlease call me or emergency services immediately.\n\nSent from SafeSpace - Women Safety Platform`
      )
      
      // If emergency contacts are set up, try to send to them first
      if (emergencyContacts.length > 0) {
        const firstContact = emergencyContacts[0]
        const whatsappUrl = `https://wa.me/${firstContact.phone.replace(/\D/g, '')}?text=${message}`
        window.open(whatsappUrl, '_blank')
        toast.success(`Emergency alert sent to ${firstContact.name}!`)
      } else {
        // Redirect to WhatsApp contact selection
        const whatsappUrl = `https://wa.me/?text=${message}`
        window.open(whatsappUrl, '_blank')
        toast.success('Location shared! Please select your emergency contact in WhatsApp.')
      }
      
    } catch (error) {
      console.error('Location error:', error)
      
      // Fallback: Show emergency numbers without location
      const fallbackMessage = encodeURIComponent(
        `🚨 EMERGENCY ALERT 🚨\n\nI need immediate help! Please call me or emergency services immediately.\n\nEmergency Numbers:\n• Police: 100\n• Women Helpline: 181\n• Emergency: 112\n\nSent from SafeSpace - Women Safety Platform`
      )
      
      if (emergencyContacts.length > 0) {
        const firstContact = emergencyContacts[0]
        const whatsappUrl = `https://wa.me/${firstContact.phone.replace(/\D/g, '')}?text=${fallbackMessage}`
        window.open(whatsappUrl, '_blank')
        toast.error(`Could not access location. Emergency message sent to ${firstContact.name} without location.`)
      } else {
        const whatsappUrl = `https://wa.me/?text=${fallbackMessage}`
        window.open(whatsappUrl, '_blank')
        toast.error('Could not access location. Emergency message sent without location.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  const EmergencySetup = () => {
    const [newContact, setNewContact] = useState({ name: '', phone: '' })

    const addContact = () => {
      if (newContact.name && newContact.phone) {
        const updated = [...emergencyContacts, newContact]
        saveEmergencyContacts(updated)
        setNewContact({ name: '', phone: '' })
        toast.success('Emergency contact added!')
      }
    }

    const removeContact = (index: number) => {
      const updated = emergencyContacts.filter((_, i) => i !== index)
      saveEmergencyContacts(updated)
      toast.success('Emergency contact removed!')
    }

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSetup(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Add emergency contacts who will receive your location in case of emergency.
          </p>

          {/* Existing Contacts */}
          {emergencyContacts.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Your Emergency Contacts:</h4>
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded mb-2">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeContact(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Contact */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Contact Name"
              value={newContact.name}
              onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone Number (with country code)"
              value={newContact.phone}
              onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <Button
              onClick={addContact}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Add Emergency Contact
            </Button>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Emergency contacts will receive your location via WhatsApp when you use the emergency button.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="fixed bottom-4 left-4 z-40">
        <div className="flex flex-col space-y-2">
          {/* Emergency Button */}
          <Button
            onClick={handleEmergency}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 shadow-2xl border-2 border-white/20 hover:scale-110 transition-all duration-200 animate-pulse"
            aria-label="Emergency - Share Location"
          >
            <div className="relative">
              <AlertTriangle className="h-6 w-6" />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </Button>

          {/* Setup Button */}
          <Button
            onClick={() => setShowSetup(true)}
            className="bg-gray-600 hover:bg-gray-700 text-white rounded-full w-12 h-12 shadow-lg border-2 border-white/20 hover:scale-110 transition-all duration-200"
            aria-label="Setup Emergency Contacts"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-24 left-0 bg-white border border-red-200 rounded-lg shadow-lg p-3 w-48 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="font-medium text-sm text-red-600">Emergency Alert</span>
          </div>
          <p className="text-xs text-gray-600">
            Share your location with emergency contacts via WhatsApp
          </p>
          {emergencyContacts.length > 0 && (
            <p className="text-xs text-green-600 mt-1">
              ✓ {emergencyContacts.length} contact(s) configured
            </p>
          )}
        </div>
      </div>

      {/* Emergency Setup Modal */}
      {showSetup && <EmergencySetup />}
    </>
  )
} 