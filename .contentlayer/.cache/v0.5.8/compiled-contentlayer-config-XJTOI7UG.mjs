// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer2/source-files";
var Poem = defineDocumentType(() => ({
  name: "Poem",
  filePathPattern: `poems/**/*.md`,
  fields: {
    title: { type: "string", required: true },
    date: { type: "date", required: true }
  },
  computedFields: {
    url: { type: "string", resolve: (poem) => `/poems/${poem._raw.flattenedPath}` }
  }
}));
var contentlayer_config_default = makeSource({ contentDirPath: "poems", documentTypes: [Poem] });
export {
  Poem,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-XJTOI7UG.mjs.map
