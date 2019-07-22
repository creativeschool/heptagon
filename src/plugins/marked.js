import marked from 'marked'

export const renderMarkdown = (text) => {
  if (text) return marked(text)
  return ''
}
