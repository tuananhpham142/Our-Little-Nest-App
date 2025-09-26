// src/components/NotFound/NotFoundCard.tsx - Inline NotFound component
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotFoundCardProps {
  title?: string;
  message?: string;
  emoji?: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: any;
  compact?: boolean;
}

interface EmptyStateProps {
  type: 'general' | 'articles' | 'categories' | 'tags' | 'search' | 'favorites' | 'history';
  searchQuery?: string;
  onRefresh?: () => void;
  onSearch?: () => void;
  onBrowse?: () => void;
}
interface ErrorMessageProps {
  error: string | null;
  onRetry?: () => void;
  compact?: boolean;
}

interface LoadingWithFallbackProps {
  isLoading: boolean;
  error: string | null;
  hasData: boolean;
  children: React.ReactNode;
  emptyStateProps?: Partial<EmptyStateProps>;
  errorProps?: Partial<ErrorMessageProps>;
}

const { width } = Dimensions.get('window');

export const NotFoundCard: React.FC<NotFoundCardProps> = ({
  title = 'Nothing Found',
  message = 'No content available at the moment.',
  emoji = '🔍',
  actionText = 'Try Again',
  onActionPress,
  style,
  compact = false,
}) => {
  return (
    <View style={[styles.container, compact && styles.compactContainer, style]}>
      <Text style={[styles.emoji, compact && styles.compactEmoji]}>{emoji}</Text>
      <Text style={[styles.title, compact && styles.compactTitle]}>{title}</Text>
      <Text style={[styles.message, compact && styles.compactMessage]}>{message}</Text>

      {onActionPress && (
        <TouchableOpacity style={[styles.actionButton, compact && styles.compactActionButton]} onPress={onActionPress}>
          <Text style={styles.actionButtonText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// src/components/NotFound/EmptyState.tsx - Empty state for lists
export const EmptyState: React.FC<EmptyStateProps> = ({ type, searchQuery, onRefresh, onSearch, onBrowse }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'articles':
        return {
          emoji: '📖',
          title: 'No Articles Yet',
          message: 'Check back soon for new baby care articles and tips!',
          actionText: 'Refresh',
          onAction: onRefresh,
        };
      case 'categories':
        return {
          emoji: '📂',
          title: 'No Categories',
          message: 'Categories are being set up. Please check back later.',
          actionText: 'Refresh',
          onAction: onRefresh,
        };
      case 'tags':
        return {
          emoji: '🏷️',
          title: 'No Tags Available',
          message: 'Tags will appear here as content is organized.',
          actionText: 'Refresh',
          onAction: onRefresh,
        };
      case 'search':
        return {
          emoji: '🔍',
          title: 'No Search Results',
          message: searchQuery
            ? `No results found for "${searchQuery}". Try different keywords.`
            : 'Start typing to search for baby care articles.',
          actionText: 'Browse Categories',
          onAction: onBrowse,
        };
      case 'favorites':
        return {
          emoji: '❤️',
          title: 'No Favorites Yet',
          message: 'Articles you like will appear here for easy access.',
          actionText: 'Discover Articles',
          onAction: onBrowse,
        };
      case 'history':
        return {
          emoji: '📚',
          title: 'No Reading History',
          message: 'Articles you read will appear here for quick reference.',
          actionText: 'Start Reading',
          onAction: onBrowse,
        };
      default:
        return {
          emoji: '🤱',
          title: 'Nothing Here',
          message: 'Content will appear here when available.',
          actionText: 'Refresh',
          onAction: onRefresh,
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateEmoji}>{content.emoji}</Text>
      <Text style={styles.emptyStateTitle}>{content.title}</Text>
      <Text style={styles.emptyStateMessage}>{content.message}</Text>

      <View style={styles.emptyStateActions}>
        {content.onAction && (
          <TouchableOpacity style={styles.emptyStateButton} onPress={content.onAction}>
            <Text style={styles.emptyStateButtonText}>{content.actionText}</Text>
          </TouchableOpacity>
        )}

        {type === 'search' && onSearch && (
          <TouchableOpacity style={[styles.emptyStateButton, styles.secondaryButton]} onPress={onSearch}>
            <Text style={[styles.emptyStateButtonText, styles.secondaryButtonText]}>Try Different Search</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// src/components/NotFound/ErrorMessage.tsx - Simple error display
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry, compact = false }) => {
  if (!error) return null;

  return (
    <View style={[styles.errorContainer, compact && styles.compactErrorContainer]}>
      <Text style={styles.errorEmoji}>⚠️</Text>
      <Text style={[styles.errorTitle, compact && styles.compactErrorTitle]}>Oops! Something went wrong</Text>
      <Text style={[styles.errorMessage, compact && styles.compactErrorMessage]}>{error}</Text>

      {onRetry && (
        <TouchableOpacity style={[styles.retryButton, compact && styles.compactRetryButton]} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// src/components/NotFound/LoadingWithFallback.tsx - Loading with fallback
export const LoadingWithFallback: React.FC<LoadingWithFallbackProps> = ({
  isLoading,
  error,
  hasData,
  children,
  emptyStateProps,
  errorProps,
}) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>⏳</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorMessage error={error} {...errorProps} />;
  }

  if (!hasData) {
    return <EmptyState type='articles' {...emptyStateProps} />;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactContainer: {
    padding: 16,
    margin: 8,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  compactEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    maxWidth: width * 0.7,
  },
  compactMessage: {
    fontSize: 12,
    marginBottom: 12,
    maxWidth: width * 0.8,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  compactActionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStateMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: width * 0.8,
  },
  emptyStateActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  emptyStateButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
    marginVertical: 4,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },

  // Error Message Styles
  errorContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    margin: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  compactErrorContainer: {
    padding: 16,
    margin: 8,
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 8,
  },
  compactErrorTitle: {
    fontSize: 16,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  compactErrorMessage: {
    fontSize: 12,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  compactRetryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
