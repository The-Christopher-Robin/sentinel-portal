import { Router } from 'express'

const GIT_SHA = process.env.GIT_SHA ?? 'dev'
const BUILD_TIME = process.env.BUILD_TIME ?? new Date().toISOString()

export const versionRouter = Router()

versionRouter.get('/version', (_req, res) => {
  res.json({
    service: 'sentinel-chat-api',
    sha: GIT_SHA,
    buildTime: BUILD_TIME,
    node: process.version,
  })
})
