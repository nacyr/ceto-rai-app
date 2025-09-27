import { Twitter, Facebook, Linkedin } from 'lucide-react'

type ShareProps = {
  title: string
  description: string
  url: string
}

export function SocialShare({ title, description, url }: ShareProps) {
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(description)}`
  }

  return (
    <div className="flex space-x-4">
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" 
         className="text-gray-500 hover:text-teal-600">
        <Twitter className="h-5 w-5" />
      </a>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"
         className="text-gray-500 hover:text-teal-600">
        <Facebook className="h-5 w-5" />
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer"
         className="text-gray-500 hover:text-teal-600">
        <Linkedin className="h-5 w-5" />
      </a>
    </div>
  )
}
