import { getChapterBySlug, getAllChapters } from '@/lib/chapters'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkGfm from 'remark-gfm'

const components = {
  // Custom components can be added here
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const chapters = getAllChapters()
  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const chapter = getChapterBySlug(slug)
  
  if (!chapter) {
    return { title: '章节未找到' }
  }
  
  return {
    title: `${chapter.meta.title} - 代数几何基础`,
    description: chapter.meta.description,
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { slug } = await params
  const chapter = getChapterBySlug(slug)
  const chapters = getAllChapters()

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">章节未找到</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            返回目录
          </Link>
        </div>
      </div>
    )
  }

  const currentIndex = chapters.findIndex(c => c.slug === slug)
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← 返回目录
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <article className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900
          prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-gray-900 prose-pre:text-gray-100
          prose-table:border-collapse prose-table:w-full
          prose-th:border prose-th:border-gray-300 prose-th:px-3 prose-th:py-2 prose-th:bg-gray-50
          prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:not-italic
          prose-hr:border-gray-300
          prose-img:rounded-lg
        ">
          <MDXRemote
            source={chapter.content}
            components={components}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkMath, remarkGfm],
                rehypePlugins: [rehypeKatex],
              },
            }}
          />
        </article>

        <nav className="mt-12 pt-8 border-t flex justify-between">
          {prevChapter ? (
            <Link
              href={`/chapters/${prevChapter.slug}`}
              className="text-blue-600 hover:underline"
            >
              ← {prevChapter.title}
            </Link>
          ) : <span />}
          
          {nextChapter && (
            <Link
              href={`/chapters/${nextChapter.slug}`}
              className="text-blue-600 hover:underline"
            >
              {nextChapter.title} →
            </Link>
          )}
        </nav>
      </main>
    </div>
  )
}
