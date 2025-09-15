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
    <View className='flex-row bg-white px-4 border-b border-gray-200'>
      {[
        { key: 'all', label: 'All Members', count: members.length },
        { key: 'primary', label: 'Primary', count: getPrimaryCaregiversCount() },
        { key: 'permissions', label: 'Permissions', count: 0 },
      ].map((tab) => (
        <TouchableOpacity
          key={tab.key}
          className={`flex-1 py-3 items-center border-b-2 ${selectedTab === tab.key ? 'border-blue-500' : 'border-transparent'}`}
          onPress={() => setSelectedTab(tab.key as any)}
        >
          <Text
            className={`text-sm font-medium ${selectedTab === tab.key ? 'text-blue-500 font-semibold' : 'text-gray-500'}`}
          >
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
        className='bg-white rounded-xl mb-3 shadow-sm overflow-hidden'
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, index * 5],
              }),
            },
          ],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <TouchableOpacity
          className='flex-row items-center p-4'
          onPress={() => handleMemberPress(member)}
          activeOpacity={0.7}
        >
          {/* Avatar */}
          <View className='relative mr-3'>
            {member.user?.avatar ? (
              <Image source={{ uri: member.user.avatar }} className='w-12 h-12 rounded-full' />
            ) : (
              <View className='w-12 h-12 rounded-full bg-blue-100 justify-center items-center'>
                <Text className='text-lg font-bold text-blue-500'>{memberName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            {member.isPrimary && (
              <View className='absolute -top-1 -right-1 bg-yellow-400 rounded-lg w-5 h-5 justify-center items-center'>
                <Text className='text-xs'>👑</Text>
              </View>
            )}
            {isCurrentUser && (
              <View className='absolute -bottom-1 -left-1 bg-green-500 rounded-lg px-1 py-0.5'>
                <Text className='text-xs text-white font-bold'>You</Text>
              </View>
            )}
          </View>

          {/* Member Info */}
          <View className='flex-1'>
            <Text className='text-base font-bold text-gray-800 mb-0.5'>{memberName}</Text>
            <Text className='text-sm text-gray-500 mb-0.5'>
              {RELATION_DISPLAY_NAMES[member.relationType]}
              {member.isPrimary && ' • Primary Caregiver'}
            </Text>
            {member.user?.email && <Text className='text-xs text-gray-400 mb-0.5'>{member.user.email}</Text>}
            <Text className='text-xs text-blue-500 font-medium'>
              {member.permissions.length} permission{member.permissions.length !== 1 ? 's' : ''}
            </Text>
          </View>

          {/* Actions */}
          <View className='justify-center'>
            <TouchableOpacity className='p-2' onPress={() => handleExpandMember(member.userId)}>
              <Text className='text-base text-gray-500'>{isExpanded ? '▼' : '▶'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <Animated.View className='border-t border-gray-100 px-4 pb-4'>
            {/* Permissions List */}
            <View className='mb-4'>
              <Text className='text-sm font-bold text-gray-800 mb-2 mt-2'>Permissions</Text>
              <View className='ml-2'>
                {member.permissions.map((permission) => (
                  <View key={permission} className='flex-row items-center mb-1'>
                    <Text className='text-xs text-green-500 mr-2 w-4'>✓</Text>
                    <Text className='text-xs text-gray-500 flex-1'>{PERMISSION_DISPLAY_NAMES[permission]}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            {canEdit && (
              <View className='flex-row flex-wrap mb-3'>
                <TouchableOpacity
                  className='bg-gray-50 px-3 py-1.5 rounded-2xl mr-2 mb-2'
                  onPress={() => handleMemberPress(member)}
                >
                  <Text className='text-xs text-gray-500 font-medium'>✏️ Edit Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`px-3 py-1.5 rounded-2xl mr-2 mb-2 ${member.isPrimary ? 'bg-orange-50' : 'bg-green-50'}`}
                  onPress={() => handleTogglePrimary(member)}
                >
                  <Text className={`text-xs font-medium ${member.isPrimary ? 'text-orange-500' : 'text-green-500'}`}>
                    {member.isPrimary ? '👑 Remove Primary' : '👑 Make Primary'}
                  </Text>
                </TouchableOpacity>

                {canRemove && (
                  <TouchableOpacity
                    className='bg-red-50 px-3 py-1.5 rounded-2xl mr-2 mb-2'
                    onPress={() => handleRemoveMember(member)}
                  >
                    <Text className='text-xs text-red-500 font-medium'>🗑️ Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Added Info */}
            <View className='border-t border-gray-100 pt-2'>
              <Text className='text-xs text-gray-400'>Added {new Date(member.addedAt).toLocaleDateString()}</Text>
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
        className='bg-white rounded-xl p-4 shadow-sm'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <Text className='text-xl font-bold text-gray-800 mb-1'>Permissions Overview</Text>
        <Text className='text-sm text-gray-500 mb-4'>See which permissions are granted to family members</Text>

        <View className='mt-2'>
          {Object.entries(PERMISSION_DISPLAY_NAMES).map(([permission, label]) => (
            <View key={permission} className='mb-4 pb-3 border-b border-gray-100'>
              <View className='flex-row justify-between items-center mb-1'>
                <Text className='text-sm font-semibold text-gray-800 flex-1'>{label}</Text>
                <View className='bg-blue-100 rounded-xl px-2 py-0.5 min-w-6 items-center'>
                  <Text className='text-xs font-bold text-blue-500'>
                    {permissionStats[permission as BabyPermissionEnum] || 0}
                  </Text>
                </View>
              </View>

              {/* Members with this permission */}
              <View className='flex-row flex-wrap'>
                {members
                  .filter((member) => member.permissions.includes(permission as BabyPermissionEnum))
                  .slice(0, 3)
                  .map((member, index) => (
                    <Text key={member.userId} className='text-xs text-gray-500'>
                      {member.displayName || RELATION_DISPLAY_NAMES[member.relationType]}
                      {index < 2 &&
                      index < members.filter((m) => m.permissions.includes(permission as BabyPermissionEnum)).length - 1
                        ? ', '
                        : ''}
                    </Text>
                  ))}
                {members.filter((m) => m.permissions.includes(permission as BabyPermissionEnum)).length > 3 && (
                  <Text className='text-xs text-gray-400 italic'>
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
    <SafeAreaView className='flex-1 bg-gray-50'>
      {/* Header */}
      <Animated.View
        className='bg-white p-4 flex-row justify-between items-center border-b border-gray-200'
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View className='flex-1'>
          <Text className='text-2xl font-bold text-gray-800'>{currentBaby.name}'s Family</Text>
          <Text className='text-sm text-gray-500 mt-0.5'>
            {members.length} member{members.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <TouchableOpacity
          className='bg-green-500 px-4 py-2 rounded-2xl'
          onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
        >
          <Text className='text-white text-sm font-semibold'>👥 Invite</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Tab Selector */}
      {renderTabSelector()}

      {/* Content */}
      <ScrollView
        className='flex-1'
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
          <View className='p-4'>
            {selectedTab === 'permissions' ? (
              renderPermissionsOverview()
            ) : (
              <View className='mb-5'>{filteredMembers.map((member, index) => renderMemberCard(member, index))}</View>
            )}

            {/* Family Tips */}
            <View className='bg-green-50 rounded-xl p-4 mt-5'>
              <Text className='text-base font-bold text-green-800 mb-3'>💡 Family Management Tips</Text>
              <View className='mb-2'>
                <Text className='text-sm text-green-800 leading-5'>
                  • Primary caregivers have full access and cannot be removed by other members
                </Text>
              </View>
              <View className='mb-2'>
                <Text className='text-sm text-green-800 leading-5'>
                  • There must always be at least one primary caregiver
                </Text>
              </View>
              <View className='mb-2'>
                <Text className='text-sm text-green-800 leading-5'>
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

export default ManageFamilyMemberScreen;
