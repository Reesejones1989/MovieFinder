// Streaming embed providers used on the movie/TV player pages.
// Each provider knows how to build an embed URL from an IMDb id
// (and season/episode, for TV).

export const PROVIDERS = [
  {
    id: "vidsrc",
    label: "VidSrc",
    movie: (id) => `https://vsembed.ru/embed/movie/${id}`,
    tv: (id, season, episode) =>
      `https://vsembed.ru/embed/tv/${id}/${season}/${episode}`,
  },
  {
    id: "multiembed",
    label: "MultiEmbed",
    movie: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=0`,
    tv: (id, season, episode) =>
      `https://multiembed.mov/?video_id=${id}&tmdb=0&s=${season}&e=${episode}`,
  },
  {
    id: "2embed",
    label: "2Embed",
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv: (id, season, episode) =>
      `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
  },
  {
    id: "smashystream",
    label: "SmashyStream",
    movie: (id) => `https://player.smashy.stream/movie/${id}`,
    tv: (id, season, episode) =>
      `https://player.smashy.stream/tv/${id}?s=${season}&e=${episode}`,
  },
  {
    id: "vidlink",
    label: "VidLink",
    movie: (id) => `https://vidlink.pro/movie/${id}`,
    tv: (id, season, episode) =>
      `https://vidlink.pro/tv/${id}/${season}/${episode}`,
  },
];

export const DEFAULT_PROVIDER_ID = "vidsrc";

export function getProvider(id) {
  return PROVIDERS.find((p) => p.id === id) || PROVIDERS[0];
}
