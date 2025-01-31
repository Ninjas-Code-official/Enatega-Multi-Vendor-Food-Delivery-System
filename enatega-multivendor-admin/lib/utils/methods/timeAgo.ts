export const timeAgo = (timestamp: number): string => {
  if (isNaN(timestamp) || timestamp <= 0) {
    return 'Invalid date';
  }
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);

  return `${years}y ago`;
};
