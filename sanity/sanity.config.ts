import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { landingPage } from './schemas/landingPage'
import { blogPost } from './schemas/blogPost'

export default defineConfig({
  name: 'sentinel-portal',
  title: 'SentinelPortal CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'placeholder',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: [landingPage, blogPost],
  },
})
