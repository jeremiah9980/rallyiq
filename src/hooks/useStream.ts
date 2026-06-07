'use client'

export interface StreamOpts {
  system: string
  messages: Array<{ role: string; content: string }>
  max_tokens?: number
  onText?: (delta: string, full: string) => void
  onDone?: (full: string) => void
  onError?: (err: Error) => void
}

export function useStream(apiKey: string) {
  const streamClaude = async (opts: StreamOpts) => {
    if (!apiKey) {
      opts.onError?.(new Error('No API key set'))
      return null
    }
    const max_tokens = opts.max_tokens || 2000
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens,
          system: opts.system,
          messages: opts.messages,
          stream: true,
        }),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error((e.error && e.error.message) || 'API error ' + res.status)
      }
      const reader = res.body!.getReader()
      const dec = new TextDecoder()
      let buf = '', full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n')
        buf = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (!data || data === '[DONE]') continue
          try {
            const ev = JSON.parse(data)
            if (ev.type === 'content_block_delta' && ev.delta && ev.delta.text) {
              full += ev.delta.text
              opts.onText?.(ev.delta.text, full)
            }
          } catch {}
        }
      }
      opts.onDone?.(full)
      return full
    } catch (err) {
      opts.onError?.(err as Error)
      return null
    }
  }

  return { streamClaude }
}
