/**
 * Script to update the README.md with the latest 3 repos from GitHub
 * @author Jose Ramos
 */

import https from 'node:https'
import { USERNAME, REPOS_SECTION } from './consts.js'

const REPOS_PLACEHOLDER = typeof REPOS_SECTION === 'string'
  ? REPOS_SECTION
  : Object.keys(REPOS_SECTION)[0]

function fetchRepos () {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: `/users/${USERNAME}/repos?sort=pushed&direction=desc&per_page=10&type=public`,
      method: "GET",
      headers: {
        "User-Agent": "readme-bot",
        Accept: "application/vnd.github.v3+json",
        // If you want to include private repos, add your PAT:
        // "Authorization": `token ${process.env.GH_TOKEN}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Error parsing GitHub API response"));
        }
      });
    });

    req.on("error", reject);
    req.end();
  });
}

function formatRepo (repo) {
  const name = repo.name;
  const url = repo.html_url;
  const description = repo.description || "_No description provided._";
  const language = repo.language || "Unknown";
  const stars = repo.stargazers_count;
  const visibility = repo.private ? "Private" : "Public";
  const visibilityBadge = visibility === "Public" ? "🟢 Public" : "🔒 Private";

  return [
    `<article class="repo-card">`,
    `  <header class="repo-card__header">`,
    `    <h4 class="repo-card__title"><a href="${url}">${name}</a></h4>`,
    `    <span class="repo-card__badge">${visibilityBadge}</span>`,
    `  </header>`,
    `  <p class="repo-card__desc">${description}</p>`,
    `  <p class="repo-card__meta"><code>${language}</code> &nbsp;·&nbsp; ${stars ? stars + " ⭐" : ""}</p>`,
    `</article>`,
  ].join("\n");
}

export async function getReposHTML () {
  const repos = await fetchRepos();

  // Filter out the profile repo itself and take top 3
  const filtered = repos
    //.filter((r) => r.name !== USERNAME && !r.fork)
    .filter((r) => r.name !== USERNAME)
    .slice(0, 3);

  const repoCards = filtered.map(formatRepo).join("\n");
  const repoSection = [
    `<style>`,
    `.repo-grid {`,
    `  display: grid;`,
    `  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));`,
    `  gap: 16px;`,
    `  margin: 12px 0 0;`,
    `}`,
    `.repo-card {`,
    `  border: 1px solid rgba(255, 255, 255, 0.12);`,
    `  border-radius: 12px;`,
    `  padding: 14px 16px;`,
    `  background: rgba(255, 255, 255, 0.04);`,
    `  backdrop-filter: blur(4px);`,
    `  text-align: left;`,
    `}`,
    `.repo-card__header {`,
    `  display: flex;`,
    `  align-items: center;`,
    `  justify-content: space-between;`,
    `  gap: 8px;`,
    `  margin-bottom: 6px;`,
    `}`,
    `.repo-card__title {`,
    `  margin: 0;`,
    `  font-size: 1rem;`,
    `}`,
    `.repo-card__title a {`,
    `  text-decoration: none;`,
    `}`,
    `.repo-card__badge {`,
    `  font-size: 0.85rem;`,
    `  opacity: 0.8;`,
    `  white-space: nowrap;`,
    `}`,
    `.repo-card__desc {`,
    `  margin: 6px 0 10px;`,
    `  font-size: 0.95rem;`,
    `}`,
    `.repo-card__meta {`,
    `  margin: 0;`,
    `  font-size: 0.9rem;`,
    `  opacity: 0.85;`,
    `}`,
    `</style>`,
    `<div class="repo-grid">`,
    repoCards,
    `</div>`
  ].join("\n");

  return {
    placeholder: REPOS_PLACEHOLDER,
    html: repoSection
  }
}