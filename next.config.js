import { withContentlayer } from 'next-contentlayer2'
import './src/env.js'

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
}

export default withContentlayer(config)
