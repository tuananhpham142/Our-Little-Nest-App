// src/screens/Baby/BabyFamilyScreen.tsx

import { LoadingWithFallback } from '@/components/template/NotFoundVariants';
import { BabyPermissionEnum, PERMISSION_DISPLAY_NAMES, RELATION_DISPLAY_NAMES } from '@/models/Baby/BabyEnum';
import { FamilyMember } from '@/models/Baby/BabyModel';
import { fetchBabyById, removeFamilyMember, updateFamilyMember } from '@/store/slices/babySlice';
import { setSelectedMember } from '@/store/slices/familyMemberSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface BabyFamilyScreenProps {
  route: {
    params: {
      babyId: string;
    };
  };
}

const BabyFamilyScreen: React.FC<BabyFamilyScreenProps> = ({ route }) => {
  const { babyId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'primary' | 'permissions'>('all');
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

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

  const getCurrentUserMember = (): FamilyMember | null => {
    if (!currentBaby) return null;
    return currentBaby.familyMembers.find((member) => member.userId === user?.id) || null;
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
    if (!currentBaby) return 0;
    return currentBaby.familyMembers.filter((member) => member.isPrimary).length;
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
    setExpandedMember(expandedMember === member.userId ? null : member.userId);
  };

  const getFilteredMembers = () => {
    if (!currentBaby) return [];

    let filtered = currentBaby.familyMembers;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (member) =>
          member.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          RELATION_DISPLAY_NAMES[member.relationType].toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by tab
    switch (selectedTab) {
      case 'primary':
        return filtered.filter((member) => member.isPrimary);
      case 'all':
      default:
        return filtered;
    }
  };

  const renderTabSelector = () => {
    if (!currentBaby) return null;

    const allCount = currentBaby.familyMembers.length;
    const primaryCount = getPrimaryCaregiversCount();

    return (
      <View className='bg-white mx-4 mb-4 rounded-2xl shadow-sm overflow-hidden'>
        <View className='flex-row'>
          {[
            { key: 'all', label: 'All Members', count: allCount },
            { key: 'primary', label: 'Primary', count: primaryCount },
            { key: 'permissions', label: 'Permissions', count: 0 },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setSelectedTab(tab.key as any)}
              className={`flex-1 py-3 items-center ${selectedTab === tab.key ? 'bg-pink-500' : 'bg-white'}`}
            >
              <Text className={`text-sm font-medium ${selectedTab === tab.key ? 'text-white' : 'text-gray-600'}`}>
                {tab.label}
                {tab.count > 0 && ` (${tab.count})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderMemberCard = (member: FamilyMember, index: number) => {
    const isExpanded = expandedMember === member.userId;
    const isCurrentUser = member.userId === user?.id;
    const memberName = member.displayName || member.user?.firstName || `${member.relationType.replace('_', ' ')}`;
    const canRemove = canRemoveMember(member);
    const canEdit = canManageFamily() && !isCurrentUser;

    return (
      <Animated.View
        key={member.userId}
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
        }}
        className='bg-white rounded-2xl mx-4 mb-3 shadow-sm overflow-hidden'
      >
        <TouchableOpacity onPress={() => handleMemberPress(member)} activeOpacity={0.8} className='p-4'>
          <View className='flex-row items-center'>
            {/* Avatar */}
            <View className='relative mr-3'>
              {member.user?.avatar ? (
                <Image source={{ uri: member.user.avatar }} className='w-14 h-14 rounded-full' />
              ) : (
                <View className='w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 justify-center items-center'>
                  <Text className='text-white text-lg font-bold'>{memberName.charAt(0).toUpperCase()}</Text>
                </View>
              )}

              {member.isPrimary && (
                <View className='absolute -top-1 -right-1 bg-yellow-400 rounded-full w-6 h-6 justify-center items-center'>
                  <Text className='text-xs'>👑</Text>
                </View>
              )}

              {isCurrentUser && (
                <View className='absolute -bottom-1 -left-1 bg-green-500 rounded-full px-1 py-0.5'>
                  <Text className='text-xs text-white font-bold'>You</Text>
                </View>
              )}
            </View>

            {/* Member Info */}
            <View className='flex-1'>
              <Text className='text-lg font-bold text-gray-800 mb-0.5'>{memberName}</Text>

              <Text className='text-sm text-gray-600 mb-1'>
                {RELATION_DISPLAY_NAMES[member.relationType]}
                {member.isPrimary && ' • Primary Caregiver'}
              </Text>

              {member.user?.email && <Text className='text-xs text-gray-400 mb-1'>{member.user.email}</Text>}

              <View className='flex-row items-center'>
                <Text className='text-xs text-blue-500 font-medium mr-2'>
                  {member.permissions.length} permission{member.permissions.length !== 1 ? 's' : ''}
                </Text>

                <Text className='text-xs text-gray-400'>Added {new Date(member.addedAt).toLocaleDateString()}</Text>
              </View>
            </View>

            {/* Expand Icon */}
            <View className='justify-center'>
              <Text className='text-gray-400 text-lg'>{isExpanded ? '▼' : '▶'}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Expanded Content */}
        {isExpanded && (
          <Animated.View className='border-t border-gray-100 px-4 pb-4'>
            {/* Permissions List */}
            <View className='mt-3 mb-4'>
              <Text className='text-sm font-bold text-gray-800 mb-2'>Permissions</Text>
              <View className='ml-2'>
                {member.permissions.map((permission) => (
                  <View key={permission} className='flex-row items-center mb-1'>
                    <Text className='text-green-500 mr-2 text-xs'>✓</Text>
                    <Text className='text-xs text-gray-600 flex-1'>{PERMISSION_DISPLAY_NAMES[permission]}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            {canEdit && (
              <View className='flex-row flex-wrap'>
                <TouchableOpacity
                  onPress={() => navigation.navigate('EditFamilyMember', { babyId, userId: member.userId })}
                  className='bg-blue-50 px-3 py-2 rounded-xl mr-2 mb-2'
                >
                  <Text className='text-blue-600 text-sm font-medium'>✏️ Edit Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleTogglePrimary(member)}
                  className={`px-3 py-2 rounded-xl mr-2 mb-2 ${member.isPrimary ? 'bg-orange-50' : 'bg-green-50'}`}
                >
                  <Text className={`text-sm font-medium ${member.isPrimary ? 'text-orange-600' : 'text-green-600'}`}>
                    {member.isPrimary ? '👑 Remove Primary' : '👑 Make Primary'}
                  </Text>
                </TouchableOpacity>

                {canRemove && (
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(member)}
                    className='bg-red-50 px-3 py-2 rounded-xl mr-2 mb-2'
                  >
                    <Text className='text-red-600 text-sm font-medium'>🗑️ Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </Animated.View>
        )}
      </Animated.View>
    );
  };

  const renderPermissionsOverview = () => {
    if (!currentBaby) return null;

    const permissionStats: Record<BabyPermissionEnum, number> = {} as any;

    // Count how many members have each permission
    Object.values(BabyPermissionEnum).forEach((permission) => {
      permissionStats[permission] = currentBaby.familyMembers.filter((member) =>
        member.permissions.includes(permission),
      ).length;
    });

    return (
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        className='bg-white rounded-2xl mx-4 p-4 shadow-sm'
      >
        <Text className='text-xl font-bold text-gray-800 mb-1'>Permissions Overview</Text>
        <Text className='text-sm text-gray-500 mb-4'>See which permissions are granted to family members</Text>

        <View className='mt-2'>
          {Object.entries(PERMISSION_DISPLAY_NAMES).map(([permission, label]) => (
            <View key={permission} className='mb-4 pb-3 border-b border-gray-100'>
              <View className='flex-row justify-between items-center mb-1'>
                <Text className='text-sm font-semibold text-gray-800 flex-1'>{label}</Text>
                <View className='bg-blue-100 rounded-full px-2 py-1 min-w-6 items-center'>
                  <Text className='text-xs font-bold text-blue-600'>
                    {permissionStats[permission as BabyPermissionEnum] || 0}
                  </Text>
                </View>
              </View>

              {/* Members with this permission */}
              <View className='flex-row flex-wrap'>
                {currentBaby.familyMembers
                  .filter((member) => member.permissions.includes(permission as BabyPermissionEnum))
                  .slice(0, 3)
                  .map((member, index) => (
                    <Text key={member.userId} className='text-xs text-gray-500'>
                      {member.displayName || RELATION_DISPLAY_NAMES[member.relationType]}
                      {index < 2 &&
                      index <
                        currentBaby.familyMembers.filter((m) =>
                          m.permissions.includes(permission as BabyPermissionEnum),
                        ).length -
                          1
                        ? ', '
                        : ''}
                    </Text>
                  ))}
                {currentBaby.familyMembers.filter((m) => m.permissions.includes(permission as BabyPermissionEnum))
                  .length > 3 && (
                  <Text className='text-xs text-gray-400 italic'>
                    +
                    {currentBaby.familyMembers.filter((m) => m.permissions.includes(permission as BabyPermissionEnum))
                      .length - 3}{' '}
                    more
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View className='flex-1 justify-center items-center px-8 py-16'>
      <Animated.View style={{ opacity: fadeAnim }} className='items-center'>
        <Text className='text-6xl mb-4'>👨‍👩‍👧‍👦</Text>
        <Text className='text-xl font-bold text-gray-800 text-center mb-3'>No Family Members Yet</Text>
        <Text className='text-base text-gray-500 text-center leading-6 mb-6'>
          Invite family members to help care for {currentBaby?.name || 'your baby'} and share precious moments together.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
          className='bg-gradient-to-r from-green-400 to-green-500 px-6 py-3 rounded-3xl shadow-lg'
        >
          <Text className='text-white text-lg font-semibold'>📧 Invite Family Member</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const filteredMembers = getFilteredMembers();

  if (!currentBaby) {
    return (
      <LoadingWithFallback
        isLoading={isLoading}
        error={error}
        hasData={false}
        emptyStateProps={{
          type: 'general',
          onRefresh: handleRefresh,
        }}
      >
        <View />
      </LoadingWithFallback>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-gradient-to-br from-pink-50 to-blue-50'>
      {/* Header */}
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        className='bg-white px-4 py-4 border-b border-gray-100 shadow-sm'
      >
        <View className='flex-row justify-between items-center mb-4'>
          <View className='flex-1'>
            <Text className='text-2xl font-bold text-gray-800'>{currentBaby.name}'s Family</Text>
            <Text className='text-sm text-gray-500'>
              {currentBaby.familyMembers.length} member{currentBaby.familyMembers.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <View className='flex-row'>
            <TouchableOpacity
              onPress={() => navigation.navigate('ManageFamilyMember', { babyId })}
              className='bg-blue-500 px-3 py-2 rounded-xl mr-2'
            >
              <Text className='text-white text-sm font-semibold'>⚙️ Manage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
              className='bg-green-500 px-3 py-2 rounded-xl'
            >
              <Text className='text-white text-sm font-semibold'>➕ Invite</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className='bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center'>
          <Text className='text-gray-400 mr-2'>🔍</Text>
          <TextInput
            placeholder='Search family members...'
            placeholderTextColor='#999'
            value={searchQuery}
            onChangeText={setSearchQuery}
            className='flex-1 text-base text-gray-800'
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text className='text-gray-400 ml-2'>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Tab Selector */}
      {renderTabSelector()}

      {/* Content */}
      <LoadingWithFallback
        isLoading={isLoading && !refreshing}
        error={error}
        hasData={currentBaby.familyMembers.length > 0}
        emptyStateProps={{
          type: 'general',
          onRefresh: handleRefresh,
        }}
      >
        <ScrollView
          className='flex-1'
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {selectedTab === 'permissions' ? (
            renderPermissionsOverview()
          ) : filteredMembers.length === 0 ? (
            searchQuery.length > 0 ? (
              <View className='px-4 py-8 items-center'>
                <Text className='text-gray-500 text-center'>No family members found matching "{searchQuery}"</Text>
              </View>
            ) : (
              renderEmptyState()
            )
          ) : (
            <View className='py-4'>{filteredMembers.map((member, index) => renderMemberCard(member, index))}</View>
          )}

          {/* Family Tips */}
          {currentBaby.familyMembers.length > 0 && selectedTab !== 'permissions' && (
            <View className='bg-green-50 rounded-2xl mx-4 p-4 mt-4 mb-6'>
              <Text className='text-base font-bold text-green-800 mb-3'>👨‍👩‍👧‍👦 Family Tips</Text>
              <View className='flex flex-col gap-1'>
                <Text className='text-sm text-green-700 leading-5'>
                  • Primary caregivers have full access and cannot be removed by other members
                </Text>
                <Text className='text-sm text-green-700 leading-5'>
                  • There must always be at least one primary caregiver
                </Text>
                <Text className='text-sm text-green-700 leading-5'>
                  • Family members can view and contribute to your baby's growth journey
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </LoadingWithFallback>
    </SafeAreaView>
  );
};

export default BabyFamilyScreen;
