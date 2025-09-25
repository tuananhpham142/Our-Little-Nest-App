// src/screens/Baby/ManageFamilyMemberScreen.tsx

import { LoadingWithFallback } from '@/components/template/NotFoundVariants';
import { BabyPermissionEnum, PERMISSION_DISPLAY_NAMES, RELATION_DISPLAY_NAMES } from '@/models/Baby/BabyEnum';
import { FamilyMember } from '@/models/Baby/BabyModel';
import { fetchBabyById, removeFamilyMember, updateFamilyMember } from '@/store/slices/babySlice';
import {
  optimisticRoleUpdate,
  setMembers,
  setSelectedMember,
  updateMemberPermissions,
} from '@/store/slices/familyMemberSlice';
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
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ManageFamilyMemberScreenProps {
  route: {
    params: {
      babyId: string;
      userId?: string; // Optional - for editing specific member
    };
  };
}

const ManageFamilyMemberScreen: React.FC<ManageFamilyMemberScreenProps> = ({ route }) => {
  const { babyId, userId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'members' | 'permissions' | 'settings'>('members');
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<BabyPermissionEnum[]>([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

  // Redux state
  const { currentBaby, isLoading, error } = useAppSelector((state) => state.baby);
  const { user } = useAppSelector((state) => state.auth);
  const { members, isUpdating } = useAppSelector((state) => state.familyMember);

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

  // Load baby data and set up editing if userId provided
  useEffect(() => {
    if (babyId) {
      dispatch(fetchBabyById(babyId));
    }
  }, [dispatch, babyId]);

  // Update family members when baby data changes
  useEffect(() => {
    if (currentBaby?.familyMembers) {
      dispatch(setMembers(currentBaby.familyMembers));

      // If editing specific user, set them as selected
      if (userId) {
        const member = currentBaby.familyMembers.find((m) => m.userId === userId);
        if (member) {
          setEditingMember(member);
          setEditingPermissions(member.permissions);
          dispatch(setSelectedMember(userId));
        }
      }
    }
  }, [currentBaby?.familyMembers, dispatch, userId]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchBabyById(babyId));
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

  const canEditMember = (member: FamilyMember): boolean => {
    if (!canManageFamily()) return false;
    if (member.userId === user?.id) return false; // Can't edit self
    return true;
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
      `Are you sure you want to remove ${memberName} from ${currentBaby?.name}'s family? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            dispatch(removeFamilyMember({ babyId, userId: member.userId }));
            if (editingMember?.userId === member.userId) {
              setEditingMember(null);
              setEditingPermissions([]);
            }
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

          // Update editing member if applicable
          if (editingMember?.userId === member.userId) {
            setEditingMember({ ...editingMember, isPrimary: newPrimaryStatus });
          }
        },
      },
    ]);
  };

  const handleSavePermissions = () => {
    if (!editingMember) return;

    dispatch(
      updateMemberPermissions({
        babyId,
        userId: editingMember.userId,
        permissions: editingPermissions,
      }),
    );

    Alert.alert('Permissions Updated', 'The family member permissions have been updated successfully.', [
      { text: 'OK', onPress: () => setEditingMember(null) },
    ]);
  };

  const togglePermission = (permission: BabyPermissionEnum) => {
    setEditingPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission],
    );
  };

  const handleBulkAction = (action: 'remove' | 'makeNonPrimary' | 'permissions') => {
    if (selectedMembers.size === 0) {
      Alert.alert('No Members Selected', 'Please select at least one member to perform bulk actions.');
      return;
    }

    const selectedMembersList = Array.from(selectedMembers)
      .map((id) => members.find((m) => m.userId === id))
      .filter(Boolean) as FamilyMember[];

    switch (action) {
      case 'remove':
        Alert.alert(
          'Remove Selected Members',
          `Are you sure you want to remove ${selectedMembers.size} member(s) from the family?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove All',
              style: 'destructive',
              onPress: () => {
                selectedMembersList.forEach((member) => {
                  if (canRemoveMember(member)) {
                    dispatch(removeFamilyMember({ babyId, userId: member.userId }));
                  }
                });
                setSelectedMembers(new Set());
                setBulkEditMode(false);
              },
            },
          ],
        );
        break;

      case 'makeNonPrimary':
        Alert.alert(
          'Remove Primary Status',
          `Remove primary caregiver status from ${selectedMembers.size} member(s)?`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Remove Status',
              onPress: () => {
                selectedMembersList.forEach((member) => {
                  if (member.isPrimary && getPrimaryCaregiversCount() > selectedMembers.size) {
                    dispatch(
                      updateFamilyMember({
                        babyId,
                        userId: member.userId,
                        memberData: { isPrimary: false },
                      }),
                    );
                  }
                });
                setSelectedMembers(new Set());
                setBulkEditMode(false);
              },
            },
          ],
        );
        break;
    }
  };

  const getFilteredMembers = () => {
    let filtered = members;

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (member) =>
          member.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          RELATION_DISPLAY_NAMES[member.relationType].toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const renderTabSelector = () => (
    <View className='bg-white mx-4 mb-4 rounded-2xl shadow-sm overflow-hidden'>
      <View className='flex-row'>
        {[
          { key: 'members', label: 'Members', icon: '👥', count: members.length },
          { key: 'permissions', label: 'Permissions', icon: '🔒', count: 0 },
          { key: 'settings', label: 'Settings', icon: '⚙️', count: 0 },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key as any)}
            className={`flex-1 py-3 items-center ${selectedTab === tab.key ? 'bg-blue-500' : 'bg-white'}`}
          >
            <Text className='text-lg mb-1'>{tab.icon}</Text>
            <Text className={`text-xs font-medium ${selectedTab === tab.key ? 'text-white' : 'text-gray-600'}`}>
              {tab.label}
              {tab.count > 0 && ` (${tab.count})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMemberCard = (member: FamilyMember, index: number) => {
    const isCurrentUser = member.userId === user?.id;
    const memberName = member.displayName || member.user?.firstName || `${member.relationType.replace('_', ' ')}`;
    const canEdit = canEditMember(member);
    const canRemove = canRemoveMember(member);
    const isSelected = selectedMembers.has(member.userId);

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
        className={`bg-white rounded-2xl mx-4 mb-3 shadow-sm overflow-hidden ${
          isSelected ? 'border-2 border-blue-500' : ''
        }`}
      >
        <View className='p-4'>
          <View className='flex-row items-center'>
            {/* Selection Checkbox (Bulk Mode) */}
            {bulkEditMode && canEdit && (
              <TouchableOpacity
                onPress={() => {
                  const newSelected = new Set(selectedMembers);
                  if (isSelected) {
                    newSelected.delete(member.userId);
                  } else {
                    newSelected.add(member.userId);
                  }
                  setSelectedMembers(newSelected);
                }}
                className='mr-3'
              >
                <View
                  className={`w-6 h-6 border-2 rounded-md justify-center items-center ${
                    isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Text className='text-white text-sm font-bold'>✓</Text>}
                </View>
              </TouchableOpacity>
            )}

            {/* Avatar */}
            <View className='relative mr-3'>
              {member.user?.avatar ? (
                <Image source={{ uri: member.user.avatar }} className='w-14 h-14 rounded-full' />
              ) : (
                <View className='w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 justify-center items-center'>
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
              </View>
            </View>

            {/* Quick Actions */}
            <View className='items-end flex flex-col gap-1'>
              {canEdit && (
                <TouchableOpacity
                  onPress={() => {
                    setEditingMember(member);
                    setEditingPermissions(member.permissions);
                  }}
                  className='bg-blue-100 px-2 py-1 rounded-lg'
                >
                  <Text className='text-blue-600 text-xs font-semibold'>Edit</Text>
                </TouchableOpacity>
              )}

              {canEdit && (
                <TouchableOpacity
                  onPress={() => handleTogglePrimary(member)}
                  className={`px-2 py-1 rounded-lg ${member.isPrimary ? 'bg-orange-100' : 'bg-green-100'}`}
                >
                  <Text className={`text-xs font-semibold ${member.isPrimary ? 'text-orange-600' : 'text-green-600'}`}>
                    {member.isPrimary ? '👑' : '👑'}
                  </Text>
                </TouchableOpacity>
              )}

              {canRemove && (
                <TouchableOpacity
                  onPress={() => handleRemoveMember(member)}
                  className='bg-red-100 px-2 py-1 rounded-lg'
                >
                  <Text className='text-red-600 text-xs font-semibold'>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderMembersTab = () => {
    const filteredMembers = getFilteredMembers();

    return (
      <View className='flex-1'>
        {/* Bulk Edit Controls */}
        <View className='bg-white mx-4 mb-4 p-3 rounded-2xl shadow-sm'>
          <View className='flex-row justify-between items-center mb-3'>
            <Text className='text-lg font-bold text-gray-800'>Family Management</Text>

            <TouchableOpacity
              onPress={() => {
                setBulkEditMode(!bulkEditMode);
                setSelectedMembers(new Set());
              }}
              className={`px-3 py-1 rounded-xl ${bulkEditMode ? 'bg-red-100' : 'bg-blue-100'}`}
            >
              <Text className={`text-sm font-semibold ${bulkEditMode ? 'text-red-600' : 'text-blue-600'}`}>
                {bulkEditMode ? 'Cancel' : 'Bulk Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {bulkEditMode && (
            <View className='flex-row flex-wrap'>
              <TouchableOpacity
                onPress={() => handleBulkAction('remove')}
                disabled={selectedMembers.size === 0}
                className={`px-3 py-1 rounded-xl mr-2 mb-2 ${selectedMembers.size > 0 ? 'bg-red-100' : 'bg-gray-100'}`}
              >
                <Text className={`text-sm font-medium ${selectedMembers.size > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                  Remove Selected ({selectedMembers.size})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleBulkAction('makeNonPrimary')}
                disabled={selectedMembers.size === 0}
                className={`px-3 py-1 rounded-xl mr-2 mb-2 ${
                  selectedMembers.size > 0 ? 'bg-orange-100' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${selectedMembers.size > 0 ? 'text-orange-600' : 'text-gray-400'}`}
                >
                  Remove Primary Status
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Members List */}
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          showsVerticalScrollIndicator={false}
        >
          {filteredMembers.map((member, index) => renderMemberCard(member, index))}

          {filteredMembers.length === 0 && (
            <View className='items-center py-8'>
              <Text className='text-gray-500 text-center'>
                {searchQuery ? 'No members found matching your search.' : 'No family members found.'}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  const renderPermissionsTab = () => {
    if (!editingMember) {
      return (
        <View className='flex-1 justify-center items-center px-8'>
          <Text className='text-6xl mb-4'>🔒</Text>
          <Text className='text-xl font-bold text-gray-800 text-center mb-3'>Edit Member Permissions</Text>
          <Text className='text-base text-gray-500 text-center leading-6 mb-6'>
            Select a family member from the Members tab to edit their permissions.
          </Text>
          <TouchableOpacity onPress={() => setSelectedTab('members')} className='bg-blue-500 px-6 py-3 rounded-3xl'>
            <Text className='text-white font-semibold'>Go to Members</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const memberName = editingMember.displayName || editingMember.user?.firstName || 'Family Member';

    return (
      <View className='flex-1'>
        {/* Member Info */}
        <View className='bg-white mx-4 mb-4 p-4 rounded-2xl shadow-sm'>
          <Text className='text-lg font-bold text-gray-800 mb-2'>Editing Permissions</Text>
          <Text className='text-base text-gray-600'>
            {memberName} • {RELATION_DISPLAY_NAMES[editingMember.relationType]}
            {editingMember.isPrimary && ' • Primary Caregiver'}
          </Text>
        </View>

        {/* Permissions List */}
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          <View className='bg-white mx-4 rounded-2xl shadow-sm overflow-hidden'>
            {Object.entries(PERMISSION_DISPLAY_NAMES).map(([permission, label], index) => (
              <View key={permission} className={`p-4 ${index > 0 ? 'border-t border-gray-100' : ''}`}>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-1 mr-3'>
                    <Text className='text-base font-semibold text-gray-800 mb-1'>{label}</Text>
                    <Text className='text-sm text-gray-500 leading-5'>
                      {getPermissionDescription(permission as BabyPermissionEnum)}
                    </Text>
                  </View>

                  <Switch
                    value={editingPermissions.includes(permission as BabyPermissionEnum)}
                    onValueChange={() => togglePermission(permission as BabyPermissionEnum)}
                    trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                    thumbColor={editingPermissions.includes(permission as BabyPermissionEnum) ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Save Button */}
          <View className='px-4 py-4'>
            <TouchableOpacity
              onPress={handleSavePermissions}
              disabled={isUpdating}
              className={`py-3 px-6 rounded-xl ${isUpdating ? 'bg-gray-300' : 'bg-green-500'}`}
            >
              <Text className='text-white text-center font-semibold'>
                {isUpdating ? 'Updating...' : 'Save Permissions'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setEditingMember(null);
                setEditingPermissions([]);
              }}
              className='py-3 px-6 mt-2'
            >
              <Text className='text-gray-500 text-center font-semibold'>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderSettingsTab = () => (
    <View className='flex-1'>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Family Settings */}
        <View className='bg-white mx-4 mb-4 rounded-2xl shadow-sm overflow-hidden'>
          <View className='p-4 border-b border-gray-100'>
            <Text className='text-lg font-bold text-gray-800'>Family Settings</Text>
            <Text className='text-sm text-gray-500'>Configure family access and notifications</Text>
          </View>

          <View className='p-4 flex flex-col gap-4'>
            <View className='flex-row justify-between items-center'>
              <View className='flex-1'>
                <Text className='text-base font-semibold text-gray-800'>Auto-approve invitations</Text>
                <Text className='text-sm text-gray-500'>Automatically accept family invitations</Text>
              </View>
              <Switch
                value={false}
                onValueChange={() => {}}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor='#9CA3AF'
              />
            </View>

            <View className='flex-row justify-between items-center'>
              <View className='flex-1'>
                <Text className='text-base font-semibold text-gray-800'>Notify on new members</Text>
                <Text className='text-sm text-gray-500'>Get notified when new members join</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor='#FFFFFF'
              />
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View className='bg-white mx-4 mb-4 rounded-2xl shadow-sm overflow-hidden border border-red-200'>
          <View className='p-4 bg-red-50 border-b border-red-200'>
            <Text className='text-lg font-bold text-red-800'>Danger Zone</Text>
            <Text className='text-sm text-red-600'>Irreversible and destructive actions</Text>
          </View>

          <View className='p-4'>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Remove All Family Members',
                  'This will remove ALL family members except primary caregivers. This action cannot be undone.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove All', style: 'destructive', onPress: () => {} },
                  ],
                );
              }}
              className='bg-red-100 p-3 rounded-xl'
            >
              <Text className='text-red-700 font-semibold text-center'>Remove All Non-Primary Members</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const getPermissionDescription = (permission: BabyPermissionEnum): string => {
    const descriptions = {
      [BabyPermissionEnum.VIEW]: 'Can view basic baby information and photos',
      [BabyPermissionEnum.VIEW_MEDICAL]: 'Can view medical information, allergies, and medications',
      [BabyPermissionEnum.EDIT]: 'Can edit basic information like name, birth date, physical stats',
      [BabyPermissionEnum.EDIT_MEDICAL]: 'Can edit medical information and health records',
      [BabyPermissionEnum.DELETE]: 'Can delete the baby profile (use with extreme caution)',
      [BabyPermissionEnum.MANAGE_FAMILY]: 'Can add, remove, or modify other family members',
      [BabyPermissionEnum.UPLOAD_MEDIA]: 'Can upload photos, videos, and update avatar',
      [BabyPermissionEnum.VIEW_ANALYTICS]: 'Can view growth charts and development analytics',
    };
    return descriptions[permission] || '';
  };

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
    <SafeAreaView className='flex-1 bg-gradient-to-br from-blue-50 to-purple-50'>
      {/* Header */}
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        className='bg-white px-4 py-4 border-b border-gray-100 shadow-sm'
      >
        <View className='flex-row justify-between items-center mb-4'>
          <View className='flex-1'>
            <Text className='text-2xl font-bold text-gray-800'>Manage Family</Text>
            <Text className='text-sm text-gray-500'>{currentBaby.name}'s family management</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('InviteFamilyMember', { babyId })}
            className='bg-green-500 px-3 py-2 rounded-xl'
          >
            <Text className='text-white text-sm font-semibold'>+ Invite</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        {selectedTab === 'members' && (
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
        )}
      </Animated.View>

      {/* Tab Selector */}
      {renderTabSelector()}

      {/* Content */}
      <LoadingWithFallback
        isLoading={isLoading && !refreshing}
        error={error}
        hasData={members.length > 0 || selectedTab !== 'members'}
        emptyStateProps={{
          type: 'general',
          onRefresh: handleRefresh,
        }}
      >
        {selectedTab === 'members' && renderMembersTab()}
        {selectedTab === 'permissions' && renderPermissionsTab()}
        {selectedTab === 'settings' && renderSettingsTab()}
      </LoadingWithFallback>
    </SafeAreaView>
  );
};

export default ManageFamilyMemberScreen;
