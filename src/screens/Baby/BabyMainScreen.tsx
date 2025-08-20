// src/screens/Baby/BabyMainScreen.tsx

import NotFound from '@/components/NotFound';
import { LoadingWithFallback } from '@/components/template/NotFoundVariants';
import { Baby } from '@/models/Baby/BabyModel';
import { BabyService } from '@/services/baby/babyService';
import { deleteBaby, fetchBabies, fetchBabyById, setSelectedBaby } from '@/store/slices/babySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { timeAgo } from '@/utils/timeUtils';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
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

interface BabyMainScreenProps {
  route?: {
    params?: {
      babyId?: string;
    };
  };
}

const BabyMainScreen: React.FC<BabyMainScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBabyLocal, setSelectedBabyLocal] = useState<Baby | null>(null);

  // Redux state
  const { babies, currentBaby, isLoading, error, selectedBabyId } = useAppSelector((state) => state.baby);

  const { user } = useAppSelector((state) => state.auth);

  const babyId = route?.params?.babyId || selectedBabyId;
  const isDetailView = !!babyId;

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data
  useFocusEffect(
    React.useCallback(() => {
      if (isDetailView && babyId) {
        dispatch(fetchBabyById(babyId));
        dispatch(setSelectedBaby(babyId));
      } else {
        dispatch(fetchBabies({}));
      }
    }, [dispatch, isDetailView, babyId]),
  );

  // Set selected baby for detail view
  useEffect(() => {
    if (isDetailView && currentBaby) {
      setSelectedBabyLocal(currentBaby);
    } else if (!isDetailView && babies.length > 0) {
      setSelectedBabyLocal(babies[0]);
    }
  }, [isDetailView, currentBaby, babies]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (isDetailView && babyId) {
        await dispatch(fetchBabyById(babyId));
      } else {
        await dispatch(fetchBabies({}));
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleBabySelect = (baby: Baby) => {
    setSelectedBabyLocal(baby);
    dispatch(setSelectedBaby(baby.id));
    navigation.navigate('BabyTabs', { babyId, initialTab: 'Profile' });
  };

  const handleEditBaby = () => {
    if (selectedBabyLocal) {
      navigation.navigate('EditBaby', { babyId });
    }
  };

  const handleDeleteBaby = () => {
    if (selectedBabyLocal) {
      Alert.alert(
        'Delete Baby Profile',
        `Are you sure you want to delete ${selectedBabyLocal.name}'s profile? This action cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch(deleteBaby(selectedBabyLocal.id));
              if (isDetailView) {
                navigation.goBack();
              }
            },
          },
        ],
      );
    }
  };

  const handleInviteMember = () => {
    if (selectedBabyLocal) {
      navigation.navigate('InviteFamilyMember', { babyId });
    }
  };

  const getCurrentUserRelation = (baby: Baby) => {
    const member = baby.familyMembers.find((m) => m.userId === user?.id);
    return member?.relationType || 'other';
  };

  const isPrimaryCaregiver = (baby: Baby) => {
    const member = baby.familyMembers.find((m) => m.userId === user?.id);
    return member?.isPrimary || false;
  };

  const renderBabyCard = (baby: Baby, isSelected: boolean = false) => {
    const age = BabyService.calculateAge(baby.birthDate);
    const ageDisplay = BabyService.formatAge(age);
    const relation = getCurrentUserRelation(baby);
    const isPrimary = isPrimaryCaregiver(baby);

    return (
      <Animated.View
        key={baby.id}
        style={[
          styles.babyCard,
          isSelected && styles.selectedBabyCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity style={styles.babyCardContent} onPress={() => handleBabySelect(baby)} activeOpacity={0.8}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {baby.avatarUrl ? (
                <Image source={{ uri: baby.avatarUrl }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: baby.gender === 'male' ? '#4FC3F7' : '#F8BBD9' },
                  ]}
                >
                  <Text style={styles.avatarText}>{baby.gender === 'male' ? '👶🏻' : '👶🏻'}</Text>
                </View>
              )}
              {isPrimary && (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>👑</Text>
                </View>
              )}
            </View>
          </View>

          {/* Baby Info */}
          <View style={styles.babyInfo}>
            <View style={styles.nameSection}>
              <Text style={styles.babyName}>{baby.name}</Text>
              {baby.nickname && <Text style={styles.babyNickname}>"{baby.nickname}"</Text>}
            </View>

            <Text style={styles.babyAge}>{ageDisplay}</Text>
            <Text style={styles.babyGender}>{baby.gender === 'male' ? '♂️ Boy' : '♀️ Girl'}</Text>

            <View style={styles.relationSection}>
              <Text style={styles.relationText}>Your {relation.replace('_', ' ')}</Text>
              {isPrimary && <Text style={styles.primaryText}>• Primary Caregiver</Text>}
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Family</Text>
              <Text style={styles.statValue}>{baby.familyMembers.length}</Text>
            </View>

            {baby.weight && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={styles.statValue}>{(baby.weight / 1000).toFixed(1)}kg</Text>
              </View>
            )}

            {baby.height && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={styles.statValue}>{baby.height}cm</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Health Flags */}
        {(baby.allergies?.length > 0 || baby.medications?.length > 0) && (
          <View style={styles.healthFlags}>
            {baby.allergies?.length > 0 && (
              <View style={styles.healthFlag}>
                <Text style={styles.healthFlagText}>⚠️ {baby?.allergies.length} Allergies</Text>
              </View>
            )}
            {baby.medications?.length > 0 && (
              <View style={styles.healthFlag}>
                <Text style={styles.healthFlagText}>💊 {baby.medications.length} Medications</Text>
              </View>
            )}
          </View>
        )}
      </Animated.View>
    );
  };

  const renderSelectedBabyDetail = () => {
    if (!selectedBabyLocal) return null;

    const age = BabyService.calculateAge(selectedBabyLocal.birthDate);
    const ageDisplay = BabyService.formatAge(age);
    const birthDateDisplay = new Date(selectedBabyLocal.birthDate).toLocaleDateString();
    const createdTime = timeAgo(selectedBabyLocal.createdAt);

    return (
      <Animated.View
        style={[
          styles.detailSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.detailHeader}>
          <Text style={styles.detailTitle}>Baby Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleEditBaby}>
              <Text style={styles.actionButtonText}>✏️ Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleInviteMember}>
              <Text style={styles.actionButtonText}>👥 Invite</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Birth Date</Text>
              <Text style={styles.infoValue}>{birthDateDisplay}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{ageDisplay}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{selectedBabyLocal.gender === 'male' ? 'Boy ♂️' : 'Girl ♀️'}</Text>
            </View>
          </View>
        </View>

        {/* Physical Stats */}
        {(selectedBabyLocal.weight || selectedBabyLocal.height) && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Physical Stats</Text>
            <View style={styles.infoGrid}>
              {selectedBabyLocal.weight && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Weight</Text>
                  <Text style={styles.infoValue}>{(selectedBabyLocal.weight / 1000).toFixed(1)} kg</Text>
                </View>
              )}
              {selectedBabyLocal.height && (
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Height</Text>
                  <Text style={styles.infoValue}>{selectedBabyLocal.height} cm</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Family Members */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Family Members ({selectedBabyLocal.familyMembers.length})</Text>
          <View style={styles.familyList}>
            {selectedBabyLocal.familyMembers.slice(0, 3).map((member, index) => (
              <View key={member.userId} style={styles.familyMember}>
                <Text style={styles.familyMemberName}>{member.displayName || 'Family Member'}</Text>
                <Text style={styles.familyMemberRole}>
                  {member.relationType.replace('_', ' ')} {member.isPrimary ? '👑' : ''}
                </Text>
              </View>
            ))}
            {selectedBabyLocal.familyMembers.length > 3 && (
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('BabyFamily', { babyId })}
              >
                <Text style={styles.viewAllText}>View All ({selectedBabyLocal.familyMembers.length - 3} more)</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Notes */}
        {selectedBabyLocal.notes && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{selectedBabyLocal.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Profile created {createdTime}</Text>
          <TouchableOpacity onPress={handleDeleteBaby}>
            <Text style={styles.deleteText}>🗑️ Delete Profile</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateEmoji}>👶</Text>
      <Text style={styles.emptyStateTitle}>No Babies Yet</Text>
      <Text style={styles.emptyStateMessage}>
        Start by adding your first baby profile to keep track of their growth and development.
      </Text>
      <TouchableOpacity style={styles.addBabyButton} onPress={() => navigation.navigate('CreateBaby')}>
        <Text style={styles.addBabyButtonText}>➕ Add Your First Baby</Text>
      </TouchableOpacity>
    </View>
  );

  if (isDetailView && !currentBaby && !isLoading) {
    return (
      <NotFound
        type='general'
        title='Baby Not Found'
        message="The baby profile you're looking for doesn't exist or you don't have access to it."
        showSuggestions={true}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LoadingWithFallback
        isLoading={isLoading && !refreshing}
        error={error}
        hasData={isDetailView ? !!selectedBabyLocal : babies.length > 0}
        emptyStateProps={{
          type: 'articles',
          onRefresh: handleRefresh,
        }}
      >
        <ScrollView
          style={styles.scrollView}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {isDetailView ? (
            // Detail view for single baby
            <View style={styles.detailView}>
              {selectedBabyLocal && renderBabyCard(selectedBabyLocal, true)}
              {renderSelectedBabyDetail()}
            </View>
          ) : (
            // List view for all babies
            <View style={styles.listView}>
              <View style={styles.header}>
                <Text style={styles.headerTitle}>My Babies ({babies.length})</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateBaby')}>
                  <Text style={styles.addButtonText}>➕ Add Baby</Text>
                </TouchableOpacity>
              </View>

              {babies.length === 0 ? (
                renderEmptyState()
              ) : (
                <View style={styles.babiesList}>
                  {babies.map((baby) => renderBabyCard(baby, baby.id === selectedBabyLocal?.id))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </LoadingWithFallback>
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
  detailView: {
    padding: 16,
  },
  listView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  babiesList: {
    padding: 16,
  },
  babyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  selectedBabyCard: {
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
  },
  babyCardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarSection: {
    marginRight: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
  },
  primaryBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBadgeText: {
    fontSize: 12,
  },
  babyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameSection: {
    marginBottom: 4,
  },
  babyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  babyNickname: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  babyAge: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 2,
  },
  babyGender: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  relationSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  relationText: {
    fontSize: 12,
    color: '#9C27B0',
    fontWeight: '600',
  },
  primaryText: {
    fontSize: 12,
    color: '#FF9800',
    fontWeight: '600',
    marginLeft: 4,
  },
  quickStats: {
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  healthFlags: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexWrap: 'wrap',
  },
  healthFlag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  healthFlagText: {
    fontSize: 11,
    color: '#E65100',
    fontWeight: '500',
  },
  detailSection: {
    marginTop: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  familyList: {
    marginTop: 8,
  },
  familyMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  familyMemberName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  familyMemberRole: {
    fontSize: 12,
    color: '#666',
  },
  viewAllButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
  deleteText: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
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
  addBabyButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  addBabyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BabyMainScreen;
