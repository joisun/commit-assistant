
// Theme deadline status types
export type ThemeDeadlineStatus = 'healthy' | 'warning' | 'overdue';

// Theme deadline configuration
export interface ThemeDeadlineConfig {
  healthyThreshold: number;
  warningThreshold: number;
  overdueThreshold: number;
  colors: {
    healthy: string;
    warning: string;
    overdue: string;
  };
}

// Default theme deadline configuration
export const DEFAULT_THEME_DEADLINE_CONFIG: ThemeDeadlineConfig = {
  healthyThreshold: 3,
  warningThreshold: 3,
  overdueThreshold: 0,
  colors: {
    healthy: '#34D399',
    warning: '#FBBF24',
    overdue: '#F87171',
  },
};

/**
 * Calculate theme deadline status
 * @param deadline ISO date string
 * @param config Theme deadline configuration
 * @returns Theme deadline status
 */
export function calculateDeadlineStatus(
  deadline: string | undefined,
  config: ThemeDeadlineConfig
): ThemeDeadlineStatus {
  if (!deadline) return 'healthy';

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const daysUntilDeadline = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDeadline <= config.overdueThreshold) return 'overdue';
  if (daysUntilDeadline <= config.warningThreshold) return 'warning';
  return 'healthy';
}

/**
 * Format deadline for display
 * @param deadline ISO date string
 * @returns Formatted date string
 */
export function formatDeadline(deadline: string | undefined): string {
  if (!deadline) return '';
  return new Date(deadline).toLocaleDateString();
}

/**
 * Get theme deadline colors
 * @param status Theme deadline status
 * @param config Theme deadline configuration
 * @returns text and background colors
 */
export function getDeadlineColors(status: ThemeDeadlineStatus, config: ThemeDeadlineConfig) {
  let textColor = '';
  let bgColor = '';

  if (status === 'healthy') {
    textColor = 'green';
    bgColor = 'rgba(0, 128, 0, 0.1)';
  } else if (status === 'warning') {
    textColor = 'yellow';
    bgColor = 'rgba(255, 255, 0, 0.1)';
  } else { // overdue
    textColor = 'red';
    bgColor = 'rgba(255, 0, 0, 0.1)';
  }

  return {
    text: textColor,
    bg: bgColor,
  };
}
