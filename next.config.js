import createMDX from '@next/mdx'
import './src/env.js'

/** @type {import("next").NextConfig} */
const config = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
}

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
})

export default withMDX(config)
