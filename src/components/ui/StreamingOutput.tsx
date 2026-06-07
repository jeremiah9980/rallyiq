'use client'

interface Props {
  html: string
  streaming?: boolean
  className?: string
  emptyText?: string
}

function renderMarkdown(text: string): string {
  try {
    if (typeof window !== 'undefined' && (window as typeof window & { marked?: { parse: (s: string) => string } }).marked) {
      return (window as typeof window & { marked: { parse: (s: string) => string } }).marked.parse(text)
    }
  } catch {}
  return text.replace(/\n/g, '<br>')
}

export function StreamingOutput({ html, streaming, className, emptyText }: Props) {
  if (!html && !streaming) {
    return (
      <div className={`output empty ${className || ''}`}>
        {emptyText || 'Output will appear here.'}
      </div>
    )
  }

  const rendered = renderMarkdown(html)

  return (
    <div
      className={`output ${className || ''}`}
      dangerouslySetInnerHTML={{
        __html: rendered + (streaming ? '<span class="cursor"></span>' : ''),
      }}
    />
  )
}
