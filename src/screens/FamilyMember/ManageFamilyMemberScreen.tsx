// src/screens/Baby/ManageFamilyMemberScreen.tsx

import { LoadingWithFallback } from '@/components/template/NotFoundVariants';
import { BabyPermissionEnum, PERMISSION_DISPLAY_NAMES, RELATION_DISPLAY_NAMES } from '@/models/Baby/BabyEnum';
import { FamilyMember } from '@/models/Baby/BabyModel';
import { fetchBabyById, fetchFamilyMembers, removeFamilyMember, updateFamilyMember } from '@/store/slices/babySlice';
import { optimisticRoleUpdate, setMembers, setSelectedMember } from '@/store/slices/familyMemberSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
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

interface ManageFamilyMemberScreenProps {
  route: {
    params: {
      babyId: string;
    };
  };
}

const ManageFamilyMemberScreen: React.FC<ManageFamilyMemberScreenProps> = ({ route }) => {
  const { babyId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'primary' | 'permissions'>('all');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  // Redux state
  const { currentBaby, isLoading, error } = useAppSelector((state) => state.baby);
  const { user } = useAppSelector((state) => state.auth);
  const {
    members,
    isLoading: isLoadingFamilyMembers,
    error: familyMemberError,
  } = useAppSelector((state) => state.familyMember);

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
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load data
  useEffect(() => {
    if (babyId) {
      dispatch(fetchBabyById(babyId));
    }
  }, [dispatch, babyId]);

  // Update family members when baby data changes
  useEffect(() => {
    if (currentBaby?.familyMembers) {
      dispatch(setMembers(currentBaby.familyMembers));
    }
  }, [currentBaby?.familyMembers, dispatch]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchBabyById(babyId));
      await dispatch(fetchFamilyMembers(babyId));
    } finally {
      setRefreshing(false);
    }
  };

  const getCurrentUserMember = (): FamilyMember | null => {
    return members.find((member) => member.userId === user?.id) || null;
  };

  const canManageFamily = (): boolean => {
    const currentUserMember = getCurrentUserMember();
    return currentUserMember?.permissions.includes(BabyPermissionEnum.MANAGE_FAMILY) || false;
  };

  const canRemoveMember = (member: FamilyMember): boolean => {
    if (!canManageFamily()) return false;
    if (member.userId === user?.id) return false; // Can't remove self
    if (member.isPrimary && getPrimaryCaregiversCount() <= 1) return false; // Can't remove last primary
    return true;
  };

  const getPrimaryCaregiversCount = (): number => {
    return members.filter((member) => member.isPrimary).length;
  };

  const handleRemoveMember = (member: FamilyMember) => {
    const memberName = member.displayName || member.user?.firstName || 'this family member';

    Alert.alert(
      'Remove Family Member',
      `Are you sure you want to remove ${memberName} from ${currentBaby?.name}'s family?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeFamilyMember({ babyId, userId: member.userId }));
          },
        },
      ],
    );
  };

  const handleTogglePrimary = (member: FamilyMember) => {
    if (member.isPrimary && getPrimaryCaregiversCount() <= 1) {
      Alert.alert('Cannot Remove Primary Status', 'There must be at least one primary caregiver for each baby.', [
        { text: 'OK' },
      ]);
      return;
    }

    const newPrimaryStatus = !member.isPrimary;
    const actionText = newPrimaryStatus ? 'make primary caregiver' : 'remove primary caregiver status';
    const memberName = member.displayName || member.user?.firstName || 'this family member';

    Alert.alert('Update Primary Status', `Are you sure you want to ${actionText} for ${memberName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          // Optimistic update
          dispatch(
            optimisticRoleUpdate({
              userId: member.userId,
              relationType: member.relationType,
              isPrimary: newPrimaryStatus,
            }),
          );

          // API update
          dispatch(
            updateFamilyMember({
              babyId,
              userId: member.userId,
              memberData: { isPrimary: newPrimaryStatus },
            }),
          );
        },
      },
    ]);
  };

  const handleMemberPress = (member: FamilyMember) => {
    dispatch(setSelectedMember(member.userId));
    navigation.navigate('FamilyMemberDetail', { babyId, userId: member.userId });
  };

  const handleExpandMember = (memberId: string) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  const renderTabSelector = () => (
    <View style={styles.tabSelector}>
      {[
        { key: 'all', label: 'All Members', count: members.length },
        { key: 'primary', label: 'Primary', count: getPrimaryCaregiversCount() },
        { key: 'permissions', label: 'Permissions', count: 0 },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedTab === tab.key && styles.tabActive]}
          onPress={() => setSelectedTab(tab.key as any)}
        >
          <Text style={[styles.tabText, selectedTab === tab.key && styles.tabTextActive]}>
            {tab.label}
            {tab.count > 0 && ` (${tab.count})`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMemberCard = (member: FamilyMember, index: number) => {
    const isExpanded = expandedMember === member.userId;
    const isCurrentUser = member.userId === user?.id;
    const memberName = member.displayName || member.user?.firstName || `${member.relationType.replace('_', ' ')}`;
    const canRemove = canRemoveMember(member);
    const canEdit = canManageFamily() && !isCurrentUser;

    return (
      <Animated.View
        key={member.userId}
        style={[
          styles.memberCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, index * 5],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity style={styles.memberCardHeader} onPress={() => handleMemberPress(member)} activeOpacity={0.7}>
          {/* Avatar */}
          <View style={styles.memberAvatarContainer}>
            {member.user?.avatar ? (
              <Image source={{ uri: member.user.avatar }} style={styles.memberAvatar} />
            ) : (
              <View style={styles.memberAvatarPlaceholder}>
                <Text style={styles.memberAvatarText}>{memberName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            {member.isPrimary && (
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryBadgeText}>👑</Text>
              </View>
            )}
            {isCurrentUser && (
              <View style={styles.currentUserBadge}>
                <Text style={styles.currentUserBadgeText}>You</Text>
              </View>
            )}
          </View>

          {/* Member Info */}
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{memberName}</Text>
            <Text style={styles.memberRelation}>
              {RELATION_DISPLAY_NAMES[member.relationType]}
              {member.isPrimary && ' • Primary Caregiver'}
            </Text>
            {member.user?.email && <Text style={styles.memberEmail}>{member.user.email}</Text>}
            <Text style={styles.memberPermissions}>
              {member.permissions.length} permission{member.permissions.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.memberActions}>
            <TouchableOpacity style={styles.expandButton} onPress={() => handleExpandMember(member.userId)}>
              <Text style={styles.expandButtonText}>{isExpanded ? '▼' : '▶'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <Animated.View style={styles.expandedContent}>
            {/* Permissions List */}
            <View style={styles.permissionsSection}>
              <Text style={styles.permissionsSectionTitle}>Permissions</Text>
              <View style={styles.permissionsList}>
                {member.permissions.map((permission) => (
                  <View key={permission} style={styles.permissionItem}>
                    <Text style={styles.permissionIcon}>✓</Text>
                    <Text style={styles.permissionText}>{PERMISSION_DISPLAY_NAMES[permission]}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            {canEdit && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleMemberPress(member)}>
                  <Text style={styles.actionButtonText}>✏️ Edit Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, member.isPrimary ? styles.demoteButton : styles.promoteButton]}
                  onPress={() => handleTogglePrimary(member)}
                >
                  <Text
                    style={[
                      styles.actionButtonText,
                      member.isPrimary ? styles.demoteButtonText : styles.promoteButtonText,
                    ]}
                  >
                    {member.isPrimary ? '👑 Remove Primary' : '👑 Make Primary'}
                  </Text>
                </TouchableOpacity>

                {canRemove && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => handleRemoveMember(member)}
                  >
                    <Text style={[styles.actionButtonText, styles.removeButtonText]}>🗑️ Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Added Info */}
            <View style={styles.memberMetadata}>
              <Text style={styles.metadataText}>Added {new Date(member.addedAt).toLocaleDateString()}</Text>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderPermissionsOverview = () => {
    const permissionStats: Record<BabyPermissionEnum, number> = {} as any;

    // Count how many members have each permission
    Object.values(BabyPermissionEnum).forEach((permission) => {
      permissionStats[permission] = members.filter((member) => member.permissions.includes(permission)).length;
    });

    return (
      <Animated.View
        style={[
          styles.permissionsOverview,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.overviewTitle}>Permissions Overview</Text>
        <Text style={styles.overviewDescription}>See which permissions are granted to family members</Text>

        <View style={styles.permissionsGrid}>
          {Object.entries(PERMISSION_DISPLAY_NAMES).map(([permission, label]) => (
            <View key={permission} style={styles.permissionOverviewItem}>
              <View style={styles.permissionOverviewHeader}>
                <Text style={styles.permissionOverviewLabel}>{label}</Text>
                <View style={styles.permissionOverviewCount}>
                  <Text style={styles.permissionOverviewCountText}>
                    {permissionStats[permission as BabyPermissionEnum] || 0}
                  </Text>
                </View>
              </View>

              {/* Members with this permission */}
              <View style={styles.membersWithPermission}>
                {members
                  .filter((member) => member.permissions.includes(permission as BabyPermissionEnum))
                  .slice(0, 3)
                  .map((member, index) => (
                    <Text key={member.userId} style={styles.memberWithPermissionText}>
                      {member.displayName || RELATION_DISPLAY_NAMES[member.relationType]}
                      {index < 2 &&
                      index < members.filter((m) => m.permissions.includes(permission as BabyPermissionEnum)).length - 1
                        ? ', '
                        : ''}
                    </Text>
                  ))}
                {members.filter((m) => m.permissions.includes(permission as BabyPermissionEnum)).length > 3 && (
                  <Text style={styles.moreText}>
                    +{members.filter((m) => m.permissions.includes(permission as BabyPermissionEnum)).length - 3} more
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const getFilteredMembers = () => {
    switch (selectedTab) {
      case 'primary':
        return members.filter((member) => member.isPrimary);
      case 'all':
      default:
        return members;
    }
  };

  const filteredMembers = getFilteredMembers();

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
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{currentBaby.name}'s Family</Text>
          <Text style={styles.headerSubtitle}>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.inviteButton}
          onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
        >
          <Text style={styles.inviteButtonText}>👥 Invite</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Tab Selector */}
      {renderTabSelector()}

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <LoadingWithFallback
          isLoading={isLoadingFamilyMembers && !refreshing}
          error={familyMemberError}
          hasData={selectedTab === 'permissions' || filteredMembers.length > 0}
          emptyStateProps={{
            type: 'articles',
            onRefresh: handleRefresh,
          }}
        >
          <View style={styles.content}>
            {selectedTab === 'permissions' ? (
              renderPermissionsOverview()
            ) : (
              <View style={styles.membersList}>
                {filteredMembers.map((member, index) => renderMemberCard(member, index))}
              </View>
            )}

            {/* Family Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💡 Family Management Tips</Text>
              <View style={styles.tip}>
                <Text style={styles.tipText}>
                  • Primary caregivers have full access and cannot be removed by other members
                </Text>
              </View>
              <View style={styles.tip}>
                <Text style={styles.tipText}>• There must always be at least one primary caregiver</Text>
              </View>
              <View style={styles.tip}>
                <Text style={styles.tipText}>
                  • Family members can update their own display name and some preferences
                </Text>
              </View>
            </View>
          </View>
        </LoadingWithFallback>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  inviteButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  membersList: {
    marginBottom: 20,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  memberCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  memberAvatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  primaryBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFD700',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBadgeText: {
    fontSize: 10,
  },
  currentUserBadge: {
    position: 'absolute',
    bottom: -5,
    left: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  currentUserBadgeText: {
    fontSize: 8,
    color: '#fff',
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  memberRelation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  memberPermissions: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  memberActions: {
    justifyContent: 'center',
  },
  expandButton: {
    padding: 8,
  },
  expandButtonText: {
    fontSize: 16,
    color: '#666',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  permissionsSection: {
    marginBottom: 16,
  },
  permissionsSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  permissionsList: {
    marginLeft: 8,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  permissionIcon: {
    fontSize: 12,
    color: '#4CAF50',
    marginRight: 8,
    width: 16,
  },
  permissionText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  promoteButton: {
    backgroundColor: '#E8F5E8',
  },
  demoteButton: {
    backgroundColor: '#FFF3E0',
  },
  removeButton: {
    backgroundColor: '#FFEBEE',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  promoteButtonText: {
    color: '#4CAF50',
  },
  demoteButtonText: {
    color: '#FF9800',
  },
  removeButtonText: {
    color: '#F44336',
  },
  memberMetadata: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  metadataText: {
    fontSize: 11,
    color: '#999',
  },
  permissionsOverview: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  overviewDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  permissionsGrid: {
    marginTop: 8,
  },
  permissionOverviewItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  permissionOverviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  permissionOverviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  permissionOverviewCount: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  permissionOverviewCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  membersWithPermission: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberWithPermissionText: {
    fontSize: 12,
    color: '#666',
  },
  moreText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  tipsSection: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  tip: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
});

export default ManageFamilyMemberScreen;
