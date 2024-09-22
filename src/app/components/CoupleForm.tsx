import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { translations, Lang } from '@/lib/translations'
import { useDropzone } from 'react-dropzone'

interface CoupleFormProps {
  lang: Lang;
  formData: {
    coupleNames: string;
    startDate: string;
    startTime: string;
    message: string;
    imageUrls: string[];
    plan: string;
  };
  onFormChange: (changes: Partial<CoupleFormProps['formData']>) => void;
  maxPhotos: number;
}

export default function CoupleForm({ lang, formData, onFormChange, maxPhotos }: CoupleFormProps) {
  const t = translations[lang]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    onFormChange({ [id]: value } as Partial<CoupleFormProps['formData']>)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {'image/*': []},
    onDrop: (acceptedFiles) => {
      const newImageUrls: string[] = []
      acceptedFiles.slice(0, maxPhotos).forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newImageUrls.push(reader.result as string)
          if (newImageUrls.length === Math.min(acceptedFiles.length, maxPhotos)) {
            onFormChange({ imageUrls: [...formData.imageUrls, ...newImageUrls].slice(0, maxPhotos) })
          }
        }
        reader.readAsDataURL(file)
      })
    },
    maxFiles: maxPhotos
  })

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="coupleNames" className="text-gray-700">{t.couplesName}</Label>
        <Input
          id="coupleNames"
          value={formData.coupleNames}
          onChange={handleInputChange}
          placeholder={t.placeholderCoupleNames}
          className="border-pink-300 focus:border-pink-500"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-gray-700">{t.startDate}</Label>
          <div className="relative">
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              className="border-pink-300 focus:border-pink-500 pl-10"
              required
            />
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div>
          <Label htmlFor="startTime" className="text-gray-700">{t.startTime}</Label>
          <div className="relative">
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleInputChange}
              className="border-pink-300 focus:border-pink-500 pl-10"
              required
            />
            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="message" className="text-gray-700">{t.message}</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder={t.yourLoveMessage}
          className="border-pink-300 focus:border-pink-500"
          required
        />
      </div>
      <div>
        <Label htmlFor="photos" className="text-gray-700">{t.choosePhotos.replace('{max}', maxPhotos.toString())}</Label>
        <div {...getRootProps()} className="border-2 border-dashed border-pink-300 rounded-md p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>{t.dropPhotosHere.replace('{max}', maxPhotos.toString())}</p>
          ) : (
            <p>{t.dropPhotosHere.replace('{max}', maxPhotos.toString())}</p>
          )}
        </div>
      </div>
    </form>
  )
}