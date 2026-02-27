import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const chaptersDirectory = path.join(process.cwd(), 'content/chapters')

export interface ChapterMeta {
  slug: string
  title: string
  description?: string
  section: number
}

export function getAllChapters(): ChapterMeta[] {
  if (!fs.existsSync(chaptersDirectory)) {
    return []
  }

  const files = fs.readdirSync(chaptersDirectory)
  
  const chapters = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace(/\.mdx$/, '')
      const fullPath = path.join(chaptersDirectory, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        slug,
        title: data.title || slug,
        description: data.description,
        section: data.section || 1,
      }
    })
    .sort((a, b) => {
      const numA = parseInt(a.slug.match(/\d+/)?.[0] || '0')
      const numB = parseInt(b.slug.match(/\d+/)?.[0] || '0')
      return numA - numB
    })

  return chapters
}

export function getChapterBySlug(slug: string) {
  const fullPath = path.join(chaptersDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    slug,
    meta: {
      title: data.title || slug,
      description: data.description,
      section: data.section || 1,
    },
    content,
  }
}
