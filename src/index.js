/**
 * Script to update the README.md with the latest 3 repos from GitHub
 * @author Jose Ramos
 */

import { promises as fs } from 'node:fs'
import { PLACEHOLDERS, STATS_URL, STREAKS_URL, TOP_LANGS_URL } from './consts.js'
import { getReposHTML } from './updateRepos.js'

const FETCH_TIMEOUT_MS = 10_000

async function pingUrl (url) {
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
    })

    if (res.ok) {
      return true
    }

    if (res.status === 405) {
      const getRes = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
      })
      return getRes.ok
    }

    return false
  } catch {
    return false
  }
}

async function selectUrl (urls) {
  const primaryOk = await pingUrl(urls[0])
  return primaryOk ? urls[0] : urls[1]
}

async function setURLs () {
  const [statsUrl, streaksUrl, topLangsUrl] = await Promise.all([
    selectUrl(STATS_URL),
    selectUrl(STREAKS_URL),
    selectUrl(TOP_LANGS_URL)
  ])

  const items = {
    statsUrl,
    streaksUrl,
    topLangsUrl
  }

  return items
}

function generateStatsHTML (items) {
  return `
<div align="center" style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
  <a href="https://github.com/anuraghazra/github-readme-stats">
    <img height=200 src="${items.statsUrl}" alt="my Github Stats" width=400 />
  </a>
  <a href="https://git.io/streak-stats" target="_blank"><img height=200 src="${items.streaksUrl}" alt="GitHub Streak" /></a>
  <img src="${items.topLangsUrl}" alt="Top Langs" />
  <img src="https://raw.githubusercontent.com/Elanza-48/Elanza-48/main/resources/img/github-contribution-grid-snake.svg" alt="example" />
</div>`
};

async function main () {
  console.log('⏳ Checking stats URLs…')

  const [template, items, repos] = await Promise.all([
    fs.readFile('./src/README.md.tpl', { encoding: 'utf-8' }),
    setURLs(),
    getReposHTML()
  ])
  console.log('✅ Stats URLs resolved')

  const newMarkdown = template
    .replace(PLACEHOLDERS.STATS, generateStatsHTML(items))
    .replace(repos.placeholder, repos.html)
  await fs.writeFile('README.md', newMarkdown)
  console.log('✅ README.md updated successfully')
}

main().catch((error) => {
  console.error('❌ Failed to update README:', error.message)
  process.exit(1)
})