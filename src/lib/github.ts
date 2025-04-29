import { Octokit } from "octokit";

// Function to determine activity level based on contributions
export function getActivityLevel(contributions: number): 'high' | 'medium' | 'low' {
  if (contributions >= 500) return 'high';
  if (contributions >= 100) return 'medium';
  return 'low';
}

// Function to fetch user data from GitHub
export async function fetchGitHubUserData(accessToken: string) {
  const octokit = new Octokit({ auth: accessToken });
  
  try {
    // Get basic user info
    const { data: userData } = await octokit.rest.users.getAuthenticated();
    
    // Get user's repos
    const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
      sort: 'updated',
      per_page: 10, // Limit to 10 repositories
    });
    
    // Get user's contribution activity (this is an approximation)
    const { data: events } = await octokit.rest.activity.listEventsForAuthenticatedUser({
      username: userData.login,
      per_page: 100,
    });
    
    // Extract languages from repositories
    const languages = new Set<string>();
    const repoData = await Promise.all(
      repos.map(async (repo) => {
        if (repo.language) {
          languages.add(repo.language);
        }
        
        // Try to get more languages from the repo if available
        try {
          const { data: repoLangs } = await octokit.rest.repos.listLanguages({
            owner: userData.login,
            repo: repo.name,
          });
          
          Object.keys(repoLangs).forEach(lang => languages.add(lang));
        } catch (error) {
          // Ignore errors when fetching languages
        }
        
        return {
          name: repo.name,
          url: repo.html_url,
          description: repo.description || '',
          stars: repo.stargazers_count,
          language: repo.language || '',
        };
      })
    );
    
    // Extract interests from repository topics
    const interests = new Set<string>();
    for (const repo of repos.slice(0, 5)) { // Limit to first 5 repos for efficiency
      try {
        const { data: topics } = await octokit.rest.repos.getAllTopics({
          owner: userData.login,
          repo: repo.name,
        });
        
        topics.names.forEach(topic => interests.add(topic));
      } catch (error) {
        // Ignore errors when fetching topics
      }
    }
    
    // Estimate contributions count from events
    // This is a simple approximation - GitHub API doesn't directly provide total contributions
    const contributionsCount = events.length;
    
    return {
      githubId: userData.id.toString(),
      username: userData.login,
      name: userData.name,
      avatarUrl: userData.avatar_url,
      bio: userData.bio || '',
      location: userData.location || '',
      languages: Array.from(languages),
      repos: repoData,
      activityLevel: getActivityLevel(contributionsCount),
      interests: Array.from(interests),
    };
    
  } catch (error) {
    console.error('Error fetching GitHub data:', error);
    throw error;
  }
}