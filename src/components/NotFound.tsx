// src/screens/NotFound.tsx
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface NotFoundProps {
  type?: 'page' | 'article' | 'category' | 'general';
  title?: string;
  message?: string;
  searchQuery?: string;
  showSuggestions?: boolean;
}

const { width, height } = Dimensions.get('window');

const NotFound: React.FC<NotFoundProps> = ({ type = 'general', title, message, showSuggestions = true }) => {
  const navigation = useNavigation<NavigationProp<any>>();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const getNotFoundContent = () => {
    switch (type) {
      case 'article':
        return {
          emoji: '📖',
          title: title || 'Article Not Found',
          message: message || "The article you're looking for doesn't exist or has been moved.",
          suggestions: 'Here are some popular articles you might enjoy:',
        };
      case 'category':
        return {
          emoji: '📂',
          title: title || 'Category Not Found',
          message: message || "This category doesn't exist or is no longer available.",
          suggestions: 'Browse our available categories:',
        };
      case 'page':
        return {
          emoji: '🔍',
          title: title || 'Page Not Found',
          message: message || "The page you're looking for doesn't exist.",
          suggestions: 'Try these popular sections:',
        };
      default:
        return {
          emoji: '🤱',
          title: title || 'Oops! Nothing Here',
          message:
            message ||
            "We couldn't find what you're looking for, but don't worry - we're here to help with your baby care journey!",
          suggestions: "Here's what you can do:",
        };
    }
  };

  const content = getNotFoundContent();

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={handleGoHome}>
          <Text style={styles.actionButtonIcon}>🏠</Text>
          <Text style={styles.primaryButtonText}>Go Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleGoBack}>
          <Text style={styles.actionButtonIcon}>⬅️</Text>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={styles.actionButtonIcon}>📂</Text>
          <Text style={styles.secondaryButtonText}>Browse Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.actionButtonIcon}>🔍</Text>
          <Text style={styles.secondaryButtonText}>Search Articles</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHelpfulTips = () => (
    <View style={styles.tipsContainer}>
      <Text style={styles.sectionTitle}>💡 Helpful Tips</Text>
      <View style={styles.tipsList}>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>🔍</Text>
          <Text style={styles.tipText}>Use the search function to find specific baby care topics</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>📂</Text>
          <Text style={styles.tipText}>Browse categories to discover articles by topic</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>⭐</Text>
          <Text style={styles.tipText}>Check out trending articles for popular content</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipIcon}>🏠</Text>
          <Text style={styles.tipText}>Return to the home page for personalized recommendations</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Main 404 Content */}
          <View style={styles.notFoundContainer}>
            <Text style={styles.emojiIcon}>{content.emoji}</Text>
            <Text style={styles.notFoundTitle}>{content.title}</Text>
            <Text style={styles.notFoundMessage}>{content.message}</Text>
          </View>

          {/* Quick Actions */}
          {renderQuickActions()}

          {/* Helpful Tips */}
          {renderHelpfulTips()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Need help? Our baby care experts are here to support you! 👶💕</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mainContent: {
    flex: 1,
    padding: 20,
  },
  notFoundContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emojiIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  notFoundTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  notFoundMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: width * 0.8,
  },
  quickActionsContainer: {
    marginVertical: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
    minHeight: 70,
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e1e5e9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchContainer: {
    marginVertical: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 18,
  },
  suggestionsContainer: {
    marginVertical: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionContent: {
    flex: 1,
    marginRight: 12,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  suggestionMeta: {
    fontSize: 12,
    color: '#666',
  },
  suggestionIcon: {
    fontSize: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryChip: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    minWidth: (width - 60) / 2 - 6,
    alignItems: 'center',
  },
  categoryChipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsContainer: {
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipsList: {
    marginTop: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tipIcon: {
    fontSize: 18,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotFound;
