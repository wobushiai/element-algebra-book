import { getAllChapters } from '@/lib/chapters'
import Link from 'next/link'

export default function Home() {
  const chapters = getAllChapters()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">代数几何基础</h1>
          <p className="mt-2 text-gray-600">从零开始的代数几何教科书</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">目录</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => (
              <Link
                key={chapter.slug}
                href={`/chapters/${chapter.slug}`}
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <h3 className="text-lg font-medium text-gray-900">
                  {chapter.title}
                </h3>
                {chapter.description && (
                  <p className="mt-2 text-sm text-gray-600">{chapter.description}</p>
                )}
              </Link>
            ))}
          </div>
        </section>

        {chapters.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            暂无章节内容
          </div>
        )}
      </main>
    </div>
  )
}
