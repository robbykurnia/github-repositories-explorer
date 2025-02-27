export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  received_events_url: string;
  type: string;
  score: number;
  following_url: string;
  gists_url: string;
  starred_url: string;
  events_url: string;
  site_admin: boolean;
}

export interface SearchUserResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

export interface GitHubUserNormalized {
  id: number;
  name: string;
  reposUrl: string;
}

export interface SearchUserNomralized {
  keyword: string;
  totalCount: number;
  totalPage: number;
  users: GitHubUserNormalized[];
  hasSearch: boolean;
}
