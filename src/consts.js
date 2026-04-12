/**
 * Constants used across the project
 * @author Jose Ramos
 */

export const USERNAME = "JoseDev155";
export const REPOS_SECTION = Object.freeze({'%{{repos}}%': true});
export const STATS_URL = [
  `https://github-readme-stats.imjoseramos.dev/api/?username=${USERNAME}&key={STATS_KEY}&include_all_commits=true&count_private=true&show_icons=true&theme=transparent`,
  // Anurag's original URL (if you want to switch back):
  `https://github-readme-stats.vercel.app/api?username=${USERNAME}&include_all_commits=true&count_private=true&show_icons=true&theme=transparent`
];
export const STREAKS_URL = [
  `https://github-readme-streak-stats.imjoseramos.dev/demo/?user=${USERNAME}&key={STATS_KEY}&theme=transparent&card_width=400`,
  // Denver's original URL (if you want to switch back):
  `https://streak-stats.demolab.com?user=${USERNAME}&theme=transparent&card_width=400`
];
export const TOP_LANGS_URL = [
  `https://github-readme-stats.imjoseramos.dev/api/top-langs/?username=${USERNAME}&key={STATS_KEY}&layout=compact&show_icons=true&theme=transparent`,
  // Anurag's original URL (if you want to switch back):
  `https://github-readme-stats.vercel.app/api/top-langs/?username=${USERNAME}&layout=compact&show_icons=true&theme=transparent`
];

export const PLACEHOLDERS = Object.freeze({
  STATS: '%{{gh_stats}}%',
  STREAKS: '%{{gh_streaks}}%',
  LANGS: '%{{gh_top_langs}}%'
})
