"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Check, Copy, Facebook, Mail, Twitter, PhoneIcon as WhatsApp } from "lucide-react"
import { useState } from "react"

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  url: string
}

export function ShareDialog({ open, onOpenChange, title, url }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  const shareViaTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  const shareViaWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`, "_blank")
  }

  const shareViaEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this product: ${url}`)}`,
      "_blank",
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
       
          <DialogTitle>Share this product</DialogTitle>
      
        <div className="flex items-center space-x-2 mt-4">
          <Input value={url} readOnly className="flex-1" />
          <Button size="icon" variant="outline" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button variant="outline" className="flex items-center justify-center gap-2" onClick={shareViaFacebook}>
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2" onClick={shareViaTwitter}>
            <Twitter className="h-4 w-4" />
            <span>Twitter</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2" onClick={shareViaWhatsApp}>
            <WhatsApp className="h-4 w-4" />
            <span>WhatsApp</span>
          </Button>
          <Button variant="outline" className="flex items-center justify-center gap-2" onClick={shareViaEmail}>
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Share this product with your friends and family
        </div>
      </DialogContent>
    </Dialog>
  )
}
