// src/screens/Baby/BabyInfoScreen.tsx

import { LoadingWithFallback } from '@/components/template/NotFoundVariants';
import { Baby } from '@/models/Baby/BabyModel';
import { BabyService } from '@/services/baby/babyService';
import { fetchBabyById } from '@/store/slices/babySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { formatArticleDate, timeAgo } from '@/utils/timeUtils';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface BabyInfoScreenProps {
  route: {
    params: {
      babyId: string;
    };
  };
}

const BabyInfoScreen: React.FC<BabyInfoScreenProps> = ({ route }) => {
  const { babyId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInfoTab, setSelectedInfoTab] = useState<'details' | 'health' | 'family'>('details');

  // Redux state
  const { currentBaby, isLoading, error } = useAppSelector((state) => state.baby);
  const { user } = useAppSelector((state) => state.auth);

  // Initialize animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load baby data
  useEffect(() => {
    if (babyId) {
      dispatch(fetchBabyById(babyId));
    }
  }, [dispatch, babyId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchBabyById(babyId));
    } finally {
      setRefreshing(false);
    }
  };

  const calculateAgeDetails = (baby: Baby) => {
    const now = new Date();
    const birth = new Date(baby.birthDate);
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = BabyService.calculateAge(baby.birthDate);
    const diffYears = Math.floor(diffMonths / 12);

    return {
      days: diffDays,
      weeks: diffWeeks,
      months: diffMonths,
      years: diffYears,
      isNewborn: diffDays <= 28,
      isInfant: diffMonths <= 12,
      isToddler: diffMonths > 12 && diffMonths <= 36,
    };
  };

  const getGrowthPercentile = (weight: number, height: number, ageInMonths: number, gender: string) => {
    // Simplified growth percentile calculation (should use WHO growth charts)
    const weightPercentile = Math.floor(Math.random() * 100); // Mock data
    const heightPercentile = Math.floor(Math.random() * 100); // Mock data
    return { weightPercentile, heightPercentile };
  };

  const renderAgeProgress = (baby: Baby) => {
    const ageDetails = calculateAgeDetails(baby);
    const progressValue = Math.min(ageDetails.months / 24, 1); // Progress up to 2 years

    return (
      <Animated.View
        style={[
          styles.ageProgressSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Development Progress</Text>

        <View style={styles.ageDisplayContainer}>
          <View style={styles.ageMainDisplay}>
            <Text style={styles.ageNumber}>{ageDetails.months}</Text>
            <Text style={styles.ageUnit}>months old</Text>
          </View>

          <View style={styles.ageBreakdown}>
            <View style={styles.ageBreakdownItem}>
              <Text style={styles.breakdownNumber}>{ageDetails.days}</Text>
              <Text style={styles.breakdownLabel}>days</Text>
            </View>
            <View style={styles.ageBreakdownItem}>
              <Text style={styles.breakdownNumber}>{ageDetails.weeks}</Text>
              <Text style={styles.breakdownLabel}>weeks</Text>
            </View>
            {ageDetails.years > 0 && (
              <View style={styles.ageBreakdownItem}>
                <Text style={styles.breakdownNumber}>{ageDetails.years}</Text>
                <Text style={styles.breakdownLabel}>years</Text>
              </View>
            )}
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Growth Timeline (0-24 months)</Text>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', `${progressValue * 100}%`],
                  }),
                },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabelText}>Birth</Text>
            <Text style={styles.progressLabelText}>2 Years</Text>
          </View>
        </View>

        {/* Development Stage */}
        <View style={styles.developmentStage}>
          <Text style={styles.stageLabel}>Current Stage:</Text>
          <Text style={styles.stageValue}>
            {ageDetails.isNewborn
              ? '👶 Newborn'
              : ageDetails.isInfant
                ? '🍼 Infant'
                : ageDetails.isToddler
                  ? '🚼 Toddler'
                  : '👦👧 Child'}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderBasicInfo = (baby: Baby) => {
    const birthDate = formatArticleDate(baby.birthDate, { format: 'long' });
    const createdTime = timeAgo(baby.createdAt);
    const updatedTime = timeAgo(baby.updatedAt);

    return (
      <Animated.View
        style={[
          styles.infoSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Basic Information</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{baby.name}</Text>
            {baby.nickname && <Text style={styles.infoSubValue}>Nickname: "{baby.nickname}"</Text>}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Birth Date</Text>
            <Text style={styles.infoValue}>{birthDate}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{baby.gender === 'male' ? '♂️ Boy' : '♀️ Girl'}</Text>
          </View>
        </View>

        <View style={styles.timestampSection}>
          <Text style={styles.timestampText}>Profile created {createdTime}</Text>
          <Text style={styles.timestampText}>Last updated {updatedTime}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderPhysicalStats = (baby: Baby) => {
    if (!baby.weight && !baby.height) return null;

    const ageDetails = calculateAgeDetails(baby);
    const { weightPercentile, heightPercentile } = getGrowthPercentile(
      baby.weight || 0,
      baby.height || 0,
      ageDetails.months,
      baby.gender,
    );

    return (
      <Animated.View
        style={[
          styles.infoSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Physical Development</Text>

        <View style={styles.statsGrid}>
          {baby.weight && (
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>⚖️</Text>
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={styles.statValue}>{(baby.weight / 1000).toFixed(1)} kg</Text>
                <Text style={styles.statPercentile}>{weightPercentile}th percentile</Text>
              </View>
            </View>
          )}

          {baby.height && (
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Text style={styles.statEmoji}>📏</Text>
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={styles.statValue}>{baby.height} cm</Text>
                <Text style={styles.statPercentile}>{heightPercentile}th percentile</Text>
              </View>
            </View>
          )}
        </View>

        {/* Growth Chart Button */}
        <TouchableOpacity style={styles.chartButton} onPress={() => navigation.navigate('BabyHealth', { babyId })}>
          <Text style={styles.chartButtonText}>📊 View Growth Chart</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHealthInfo = (baby: Baby) => {
    const hasHealthInfo = baby.allergies?.length > 0 || baby.medications?.length > 0 || baby.notes;

    if (!hasHealthInfo) {
      return (
        <Animated.View
          style={[
            styles.infoSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Health Information</Text>
          <View style={styles.emptyHealthState}>
            <Text style={styles.emptyHealthEmoji}>🏥</Text>
            <Text style={styles.emptyHealthText}>No health information recorded yet</Text>
            <TouchableOpacity
              style={styles.addHealthButton}
              onPress={() => navigation.navigate('BabyHealth', { babyId })}
            >
              <Text style={styles.addHealthButtonText}>Add Health Info</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View
        style={[
          styles.infoSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Health Information</Text>

        {baby.allergies && baby.allergies.length > 0 && (
          <View style={styles.healthCard}>
            <View style={styles.healthCardHeader}>
              <Text style={styles.healthCardTitle}>⚠️ Allergies ({baby.allergies.length})</Text>
            </View>
            <View style={styles.healthItems}>
              {baby.allergies.map((allergy, index) => (
                <View key={index} style={styles.healthItem}>
                  <Text style={styles.healthItemText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {baby.medications && baby.medications.length > 0 && (
          <View style={styles.healthCard}>
            <View style={styles.healthCardHeader}>
              <Text style={styles.healthCardTitle}>💊 Medications ({baby.medications.length})</Text>
            </View>
            <View style={styles.healthItems}>
              {baby.medications.map((medication, index) => (
                <View key={index} style={styles.healthItem}>
                  <Text style={styles.healthItemText}>{medication}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {baby.notes && (
          <View style={styles.healthCard}>
            <View style={styles.healthCardHeader}>
              <Text style={styles.healthCardTitle}>📝 Notes</Text>
            </View>
            <Text style={styles.notesText}>{baby.notes}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.editHealthButton} onPress={() => navigation.navigate('BabyHealth', { babyId })}>
          <Text style={styles.editHealthButtonText}>✏️ Edit Health Information</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFamilyPreview = (baby: Baby) => {
    const primaryCaregivers = baby.familyMembers.filter((member) => member.isPrimary);
    const otherMembers = baby.familyMembers.filter((member) => !member.isPrimary);

    return (
      <Animated.View
        style={[
          styles.infoSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Family Members ({baby.familyMembers.length})</Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => navigation.navigate('BabyTabs', { babyId, initialTab: 'Family' })}
          >
            <Text style={styles.viewAllButtonText}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Caregivers */}
        {primaryCaregivers.length > 0 && (
          <View style={styles.familyGroup}>
            <Text style={styles.familyGroupTitle}>👑 Primary Caregivers</Text>
            {primaryCaregivers.map((member, index) => (
              <View key={member.userId} style={styles.familyMemberItem}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.displayName || 'Family Member'}</Text>
                  <Text style={styles.memberRole}>{member.relationType.replace('_', ' ')}</Text>
                </View>
                <View style={styles.memberBadges}>
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>Primary</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Other Family Members */}
        {otherMembers.length > 0 && (
          <View style={styles.familyGroup}>
            <Text style={styles.familyGroupTitle}>👨‍👩‍👧‍👦 Other Family Members</Text>
            {otherMembers.slice(0, 3).map((member, index) => (
              <View key={member.userId} style={styles.familyMemberItem}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.displayName || 'Family Member'}</Text>
                  <Text style={styles.memberRole}>{member.relationType.replace('_', ' ')}</Text>
                </View>
              </View>
            ))}
            {otherMembers.length > 3 && (
              <Text style={styles.moreMembers}>+{otherMembers.length - 3} more family members</Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
        >
          <Text style={styles.inviteButtonText}>👥 Invite Family Member</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!currentBaby) {
    return (
      <LoadingWithFallback
        isLoading={isLoading}
        error={error}
        hasData={false}
        emptyStateProps={{
          type: 'articles',
          onRefresh: handleRefresh,
        }}
      >
        <View />
      </LoadingWithFallback>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Baby Avatar and Name */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.babyHeaderInfo}>
            <View style={styles.avatarContainer}>
              {currentBaby.avatarUrl ? (
                <Image source={{ uri: currentBaby.avatarUrl }} style={styles.headerAvatar} />
              ) : (
                <View
                  style={[
                    styles.headerAvatarPlaceholder,
                    { backgroundColor: currentBaby.gender === 'male' ? '#4FC3F7' : '#F8BBD9' },
                  ]}
                >
                  <Text style={styles.headerAvatarText}>{currentBaby.gender === 'male' ? '👶🏻' : '👶🏻'}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerTextInfo}>
              <Text style={styles.headerBabyName}>{currentBaby.name}</Text>
              {currentBaby.nickname && <Text style={styles.headerBabyNickname}>"{currentBaby.nickname}"</Text>}
              <Text style={styles.headerBabyAge}>
                {BabyService.formatAge(BabyService.calculateAge(currentBaby.birthDate))}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditBaby', { babyId })}>
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Content Sections */}
        <View style={styles.content}>
          {renderAgeProgress(currentBaby)}
          {renderBasicInfo(currentBaby)}
          {renderPhysicalStats(currentBaby)}
          {renderHealthInfo(currentBaby)}
          {renderFamilyPreview(currentBaby)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  babyHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    marginRight: 16,
  },
  headerAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  headerAvatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    fontSize: 28,
  },
  headerTextInfo: {
    flex: 1,
  },
  headerBabyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerBabyNickname: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  headerBabyAge: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  ageProgressSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewAllButtonText: {
    color: '#007AFF',
    fontSize: 12,
    fontWeight: '600',
  },
  ageDisplayContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ageMainDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  ageNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  ageUnit: {
    fontSize: 16,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ageBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  ageBreakdownItem: {
    alignItems: 'center',
  },
  breakdownNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  progressLabelText: {
    fontSize: 11,
    color: '#999',
  },
  developmentStage: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  stageLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  stageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9C27B0',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  infoGrid: {
    marginBottom: 16,
  },
  infoCard: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoSubValue: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  timestampSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  timestampText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  statsGrid: {
    marginBottom: 16,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statIcon: {
    marginRight: 16,
  },
  statEmoji: {
    fontSize: 24,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  statPercentile: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  chartButton: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  chartButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyHealthState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyHealthEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyHealthText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  addHealthButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  addHealthButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  healthCard: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  healthCardHeader: {
    marginBottom: 12,
  },
  healthCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E65100',
  },
  healthItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  healthItem: {
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  healthItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  editHealthButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  editHealthButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  familyGroup: {
    marginBottom: 16,
  },
  familyGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  familyMemberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    marginBottom: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  memberBadges: {
    flexDirection: 'row',
  },
  primaryBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#B8860B',
  },
  moreMembers: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  inviteButton: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  inviteButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default BabyInfoScreen;
