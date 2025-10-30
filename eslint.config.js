import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  react: true,
  nextjs: true,
  jsx: true,
  markdown: true,

  rules: {
    'node/prefer-global/process': 'off',
    'react/no-context-provider': 'off',
    'react-refresh/only-export-components': 'off',
    'jsdoc/check-param-names': 'off',
    'node/prefer-global/buffer': 'off',
    'no-console': 'off',
    'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
    'react/no-array-index-key': 'off',
    'react-dom/no-missing-button-type': 'off',
    'react-hooks/set-state-in-effect': 'off',
  },
  ignores: ['prisma', 'next-env.d.ts', 'src/components/ui'],
})
