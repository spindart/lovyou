import React from 'react'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface CoupleFormProps {
  lang: string
  formData: any
  onFormChange: (changes: any) => void
  maxPhotos: number
}

const CoupleForm: React.FC<CoupleFormProps> = ({ lang, formData, onFormChange, maxPhotos }) => {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="coupleNames">Couple Names:</Label>
        <Input id="coupleNames" value={formData.coupleNames} onChange={(e) => onFormChange({ coupleNames: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date:</Label>
        <Input type="date" id="startDate" value={formData.startDate} onChange={(e) => onFormChange({ startDate: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="startTime">Start Time:</Label>
        <Input type="time" id="startTime" value={formData.startTime} onChange={(e) => onFormChange({ startTime: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="message">Love Message:</Label>
        <Textarea id="message" value={formData.message} onChange={(e) => onFormChange({ message: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="email">Email:</Label>
        <Input type="email" id="email" value={formData.email} onChange={(e) => onFormChange({ email: e.target.value })} />
      </div>
    </form>
  )
}

export default CoupleForm