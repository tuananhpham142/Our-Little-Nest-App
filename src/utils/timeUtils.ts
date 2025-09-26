// src/utils/timeUtils.ts

/**
 * Convert a date to a human-readable "time ago" format
 * @param date - The date to convert (can be Date object, string, or timestamp)
 * @returns Human-readable time ago string
 */
export const timeAgo = (date: Date | string | number): string => {
  try {
    const now = new Date();
    const targetDate = new Date(date);

    // Validate date
    if (isNaN(targetDate.getTime())) {
      return 'Invalid date';
    }

    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    // Handle future dates
    if (diffInSeconds < 0) {
      return 'Just now';
    }

    // Define time intervals in seconds
    const intervals = [
      { label: 'year', seconds: 31536000, plural: 'years' },
      { label: 'month', seconds: 2592000, plural: 'months' },
      { label: 'week', seconds: 604800, plural: 'weeks' },
      { label: 'day', seconds: 86400, plural: 'days' },
      { label: 'hour', seconds: 3600, plural: 'hours' },
      { label: 'minute', seconds: 60, plural: 'minutes' },
      { label: 'second', seconds: 1, plural: 'seconds' },
    ];

    // Special cases for very recent times
    if (diffInSeconds < 10) {
      return 'Just now';
    }

    if (diffInSeconds < 60) {
      return 'Less than a minute ago';
    }

    // Find the appropriate interval
    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);

      if (count >= 1) {
        const label = count === 1 ? interval.label : interval.plural;
        return `${count} ${label} ago`;
      }
    }

    return 'Just now';
  } catch (error) {
    console.error('Error in timeAgo function:', error);
    return 'Unknown time';
  }
};

/**
 * Get a short version of time ago (for compact displays)
 * @param date - The date to convert
 * @returns Short time ago string (e.g., "2h", "3d", "1w")
 */
export const timeAgoShort = (date: Date | string | number): string => {
  try {
    const now = new Date();
    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      return '?';
    }

    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    if (diffInSeconds < 0 || diffInSeconds < 60) {
      return 'now';
    }

    const intervals = [
      { suffix: 'y', seconds: 31536000 },
      { suffix: 'mo', seconds: 2592000 },
      { suffix: 'w', seconds: 604800 },
      { suffix: 'd', seconds: 86400 },
      { suffix: 'h', seconds: 3600 },
      { suffix: 'm', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return `${count}${interval.suffix}`;
      }
    }

    return 'now';
  } catch (error) {
    console.error('Error in timeAgoShort function:', error);
    return '?';
  }
};

/**
 * Estimate reading time based on content length
 * @param content - The content to analyze (HTML or plain text)
 * @param wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns Object with minutes, seconds, and formatted string
 */
export const estimateReadingTime = (
  contentLength: number,
  wordsPerMinute: number = 200,
): {
  minutes: number;
  seconds: number;
  text: string;
  totalSeconds: number;
} => {
  try {
    if (contentLength === 0) {
      return {
        minutes: 0,
        seconds: 0,
        text: '0 min read',
        totalSeconds: 0,
      };
    }

    // Strip HTML tags and decode HTML entities
    // const plainText = content
    //   .replace(/<[^>]*>/g, '') // Remove HTML tags
    //   .replace(/&nbsp;/g, ' ') // Replace &nbsp; with spaces
    //   .replace(/&amp;/g, '&') // Replace &amp; with &
    //   .replace(/&lt;/g, '<') // Replace &lt; with <
    //   .replace(/&gt;/g, '>') // Replace &gt; with >
    //   .replace(/&quot;/g, '"') // Replace &quot; with "
    //   .replace(/&#39;/g, "'") // Replace &#39; with '
    //   .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    //   .trim();

    // // Count words (split by spaces and filter out empty strings)
    // const words = plainText.split(/\s+/).filter((word) => word.length > 0);

    // const wordCount = words.length;

    // Handle very short content
    if (contentLength === 0) {
      return {
        minutes: 0,
        seconds: 0,
        text: '0 min read',
        totalSeconds: 0,
      };
    }

    // Calculate reading time
    const totalMinutes = contentLength / wordsPerMinute;
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    const totalSeconds = Math.round(totalMinutes * 60);

    // Format the text
    let text: string;

    if (minutes === 0) {
      if (seconds < 30) {
        text = 'Less than 1 min read';
      } else {
        text = '1 min read';
      }
    } else if (minutes === 1) {
      text = '1 min read';
    } else {
      text = `${minutes} min read`;
    }

    return {
      minutes: minutes === 0 ? 1 : minutes, // Minimum 1 minute
      seconds,
      text,
      totalSeconds: Math.max(60, totalSeconds), // Minimum 1 minute in seconds
    };
  } catch (error) {
    console.error('Error in estimateReadingTime function:', error);
    return {
      minutes: 1,
      seconds: 0,
      text: '1 min read',
      totalSeconds: 60,
    };
  }
};

/**
 * Get detailed reading time with word count
 * @param content - The content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 WPM)
 * @returns Extended reading time information
 */
// export const getDetailedReadingTime = (
//   content: string,
//   wordsPerMinute: number = 200,
// ): {
//   wordCount: number;
//   readingTime: ReturnType<typeof estimateReadingTime>;
//   readingSpeed: 'slow' | 'average' | 'fast';
// } => {
//   // Strip HTML and count words
//   const plainText = content
//     .replace(/<[^>]*>/g, '')
//     .replace(/\s+/g, ' ')
//     .trim();

//   const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length;
//   const readingTime = estimateReadingTime(content, wordsPerMinute);

//   // Determine reading speed category
//   let readingSpeed: 'slow' | 'average' | 'fast';
//   if (wordsPerMinute < 180) {
//     readingSpeed = 'slow';
//   } else if (wordsPerMinute > 250) {
//     readingSpeed = 'fast';
//   } else {
//     readingSpeed = 'average';
//   }

//   return {
//     wordCount,
//     readingTime,
//     readingSpeed,
//   };
// };

/**
 * Format a date for display in articles
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Formatted date string
 */
export const formatArticleDate = (
  date: Date | string | number,
  options: {
    includeTime?: boolean;
    format?: 'short' | 'medium' | 'long';
    locale?: string;
  } = {},
): string => {
  try {
    const { includeTime = false, format = 'medium', locale = 'en-US' } = options;

    const targetDate = new Date(date);

    if (isNaN(targetDate.getTime())) {
      return 'Invalid date';
    }

    const formatOptions: Intl.DateTimeFormatOptions = {};

    // Date format
    switch (format) {
      case 'short':
        formatOptions.year = '2-digit';
        formatOptions.month = 'short';
        formatOptions.day = 'numeric';
        break;
      case 'long':
        formatOptions.year = 'numeric';
        formatOptions.month = 'long';
        formatOptions.day = 'numeric';
        formatOptions.weekday = 'long';
        break;
      default: // medium
        formatOptions.year = 'numeric';
        formatOptions.month = 'short';
        formatOptions.day = 'numeric';
    }

    // Time format
    if (includeTime) {
      formatOptions.hour = 'numeric';
      formatOptions.minute = '2-digit';
      formatOptions.hour12 = true;
    }

    return targetDate.toLocaleDateString(locale, formatOptions);
  } catch (error) {
    console.error('Error in formatArticleDate function:', error);
    return 'Unknown date';
  }
};

// Export helper functions for common use cases
export const articleTimeHelpers = {
  /**
   * Get time ago for article creation
   */
  getCreatedTimeAgo: (createdAt: Date | string) => timeAgo(createdAt),

  /**
   * Get time ago for article publication
   */
  getPublishedTimeAgo: (publishedAt?: Date | string | null) => (publishedAt ? timeAgo(publishedAt) : 'Not published'),

  /**
   * Get reading time for article
   */
  getReadingTime: (contentLength: number) => estimateReadingTime(contentLength),

  /**
   * Get formatted publication date
   */
  getFormattedPublishDate: (publishedAt?: Date | string | null) =>
    publishedAt ? formatArticleDate(publishedAt) : 'Not published',

  /**
   * Get complete article timing info
   */
  getArticleTimingInfo: (article: {
    createdAt: Date | string;
    publishedAt?: Date | string | null;
    content: string;
  }) => ({
    createdTimeAgo: timeAgo(article.createdAt),
    publishedTimeAgo: article.publishedAt ? timeAgo(article.publishedAt) : null,
    readingTime: estimateReadingTime(article.content.length),
    formattedPublishDate: article.publishedAt ? formatArticleDate(article.publishedAt) : null,
  }),
};
