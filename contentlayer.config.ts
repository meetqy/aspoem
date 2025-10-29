import { defineDocumentType, makeSource } from 'contentlayer2/source-files'

export const Poem = defineDocumentType(() => ({
  name: 'Poem',
  filePathPattern: `**/*.md`,
  fields: {
    title: { type: 'string', required: true },
  },
  computedFields: {
    url: { type: 'string', resolve: poem => `/poems/${poem._raw.flattenedPath}` },
  },
}))

export default makeSource({ contentDirPath: 'poems', documentTypes: [Poem] })
