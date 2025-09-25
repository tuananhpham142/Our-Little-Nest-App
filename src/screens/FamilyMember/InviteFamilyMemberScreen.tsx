// src/screens/Baby/InviteFamilyMemberScreen.tsx

import {
  BabyPermissionEnum,
  FamilyRelationTypeEnum,
  PERMISSION_DISPLAY_NAMES,
  PERMISSION_SETS,
  RELATION_DISPLAY_NAMES,
} from '@/models/Baby/BabyEnum';
import { AddFamilyMemberFormData, AddFamilyMemberFormErrors } from '@/models/Baby/BabyForm';
import { fetchBabyById, inviteFamilyMember } from '@/store/slices/babySlice';
import { validateInvitation } from '@/store/slices/familyMemberSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface InviteFamilyMemberScreenProps {
  route: {
    params: {
      babyId: string;
    };
  };
}

const InviteFamilyMemberScreen: React.FC<InviteFamilyMemberScreenProps> = ({ route }) => {
  const { babyId } = route.params;
  const navigation = useNavigation<NavigationProp<any>>();
  const dispatch = useAppDispatch();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Form state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<AddFamilyMemberFormData>({
    email: '',
    relationType: FamilyRelationTypeEnum.OTHER,
    displayName: '',
    isPrimary: false,
    permissions: [],
    message: '',
  });

  const [formErrors, setFormErrors] = useState<AddFamilyMemberFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redux state
  const { currentBaby, isLoading } = useAppSelector((state) => state.baby);
  const { isInviting, invitationError } = useAppSelector((state) => state.familyMember);

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

  // Auto-set permissions when relation type changes
  useEffect(() => {
    if (formData.relationType) {
      const defaultPermissions = PERMISSION_SETS[formData.relationType] || [];
      setFormData((prev) => ({
        ...prev,
        permissions: defaultPermissions,
      }));
    }
  }, [formData.relationType]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep1 = (): boolean => {
    const errors: AddFamilyMemberFormErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.relationType) {
      errors.relationType = 'Please select a relationship type';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: AddFamilyMemberFormErrors = {};

    if (formData.permissions.length === 0) {
      errors.permissions = 'Please select at least one permission';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    } else {
      isValid = true;
    }

    if (isValid && currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
      animateStepTransition();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
      animateStepTransition();
    }
  };

  const animateStepTransition = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 20,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      // Validate invitation first
      await dispatch(
        validateInvitation({
          email: formData.email,
          babyId,
        }),
      ).unwrap();

      // Send invitation
      await dispatch(
        inviteFamilyMember({
          babyId,
          invitationData: {
            email: formData.email,
            relationType: formData.relationType,
            displayName: formData.displayName || undefined,
            isPrimary: formData.isPrimary,
            permissions: formData.permissions,
            message: formData.message || undefined,
          },
        }),
      ).unwrap();

      Alert.alert(
        'Invitation Sent!',
        `We've sent an invitation to ${formData.email}. They'll receive an email with instructions to join ${currentBaby?.name}'s family.`,
        [
          {
            text: 'Great!',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('Invitation Failed', error.message || 'Failed to send invitation. Please try again.', [
        { text: 'OK' },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancel Invitation?', 'Are you sure you want to cancel? Your progress will be lost.', [
      { text: 'Continue Editing', style: 'cancel' },
      { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  const togglePermission = (permission: BabyPermissionEnum) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

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

  const renderProgressIndicator = () => (
    <View className='px-4 py-3 bg-white border-b border-gray-100'>
      <View className='h-1 bg-green-100 rounded-full mb-3'>
        <View className='h-full bg-green-500 rounded-full' style={{ width: `${(currentStep / 3) * 100}%` }} />
      </View>
      <View className='flex-row justify-between'>
        {[
          { step: 1, label: 'Contact' },
          { step: 2, label: 'Permissions' },
          { step: 3, label: 'Review' },
        ].map(({ step, label }) => (
          <View key={step} className='items-center'>
            <View
              className={`w-8 h-8 rounded-full justify-center items-center mb-1 ${
                currentStep >= step ? 'bg-green-500' : 'bg-green-100'
              }`}
            >
              <Text className={`text-sm font-bold ${currentStep >= step ? 'text-white' : 'text-green-300'}`}>
                {step}
              </Text>
            </View>
            <Text className='text-xs text-gray-500'>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      className='bg-white rounded-2xl p-5 mx-4 shadow-lg'
    >
      <Text className='text-2xl font-bold text-gray-800 mb-2'>Invite Family Member</Text>
      <Text className='text-base text-gray-500 leading-6 mb-6'>
        Enter the email address and relationship type for the person you want to invite to {currentBaby?.name}'s family.
      </Text>

      {/* Email Input */}
      <View className='mb-5'>
        <Text className='text-base font-semibold text-gray-800 mb-2'>Email Address *</Text>
        <TextInput
          className={`border rounded-xl px-4 py-3 text-base text-gray-800 ${
            formErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'
          }`}
          placeholder='Enter their email address'
          placeholderTextColor='#999'
          value={formData.email}
          onChangeText={(text) => {
            setFormData((prev) => ({ ...prev, email: text }));
            if (formErrors.email) {
              setFormErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
        />
        {formErrors.email && <Text className='text-xs text-red-500 mt-1'>{formErrors.email}</Text>}
      </View>

      {/* Display Name Input */}
      <View className='mb-5'>
        <Text className='text-base font-semibold text-gray-800 mb-2'>Display Name (Optional)</Text>
        <TextInput
          className='border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-white'
          placeholder='e.g., "Grandma Sarah", "Uncle Mike"'
          placeholderTextColor='#999'
          value={formData.displayName}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, displayName: text }))}
        />
        <Text className='text-xs text-gray-400 mt-1'>
          How should they appear in the family? Leave empty to use their name.
        </Text>
      </View>

      {/* Relationship Type */}
      <View className='mb-5'>
        <Text className='text-base font-semibold text-gray-800 mb-3'>Relationship Type *</Text>
        <View className='flex-row flex-wrap'>
          {Object.entries(RELATION_DISPLAY_NAMES).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => {
                setFormData((prev) => ({ ...prev, relationType: key as FamilyRelationTypeEnum }));
                if (formErrors.relationType) {
                  setFormErrors((prev) => ({ ...prev, relationType: undefined }));
                }
              }}
              className={`px-4 py-2 rounded-2xl mr-2 mb-2 border ${
                formData.relationType === key ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <Text
                className={`text-sm font-medium ${formData.relationType === key ? 'text-green-600' : 'text-gray-600'}`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {formErrors.relationType && <Text className='text-xs text-red-500 mt-1'>{formErrors.relationType}</Text>}
      </View>

      {/* Primary Caregiver Toggle */}
      <View className='bg-yellow-50 p-4 rounded-xl'>
        <TouchableOpacity
          className='flex-row items-start'
          onPress={() => setFormData((prev) => ({ ...prev, isPrimary: !prev.isPrimary }))}
        >
          <View
            className={`w-6 h-6 border-2 rounded-md justify-center items-center mr-3 mt-0.5 ${
              formData.isPrimary ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300'
            }`}
          >
            {formData.isPrimary && <Text className='text-white text-sm font-bold'>✓</Text>}
          </View>
          <View className='flex-1'>
            <Text className='text-base font-semibold text-gray-800 mb-1'>Primary Caregiver</Text>
            <Text className='text-sm text-gray-600 leading-5'>
              Primary caregivers have full access to manage {currentBaby?.name}'s profile and cannot be removed by other
              family members. Choose this for parents or main guardians.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      className='bg-white rounded-2xl p-5 mx-4 shadow-lg'
    >
      <Text className='text-2xl font-bold text-gray-800 mb-2'>Set Permissions</Text>
      <Text className='text-base text-gray-500 leading-6 mb-6'>
        Choose what this family member can do with {currentBaby?.name}'s profile. We've pre-selected common permissions
        for {RELATION_DISPLAY_NAMES[formData.relationType]}.
      </Text>

      {/* Recommended Permissions Notice */}
      {formData.relationType && (
        <View className='bg-blue-50 p-4 rounded-xl mb-5 border-l-4 border-blue-400'>
          <Text className='text-blue-800 font-semibold mb-1'>
            Recommended for {RELATION_DISPLAY_NAMES[formData.relationType]}
          </Text>
          <Text className='text-blue-700 text-sm leading-5'>
            We've automatically selected the most common permissions for this relationship type. You can adjust them as
            needed.
          </Text>
        </View>
      )}

      {/* Permissions List */}
      <View className='mb-4'>
        {Object.entries(PERMISSION_DISPLAY_NAMES).map(([permission, label]) => (
          <TouchableOpacity
            key={permission}
            onPress={() => togglePermission(permission as BabyPermissionEnum)}
            className='flex-row items-start py-4 border-b border-gray-100'
          >
            <View
              className={`w-6 h-6 border-2 rounded-md justify-center items-center mr-3 mt-0.5 ${
                formData.permissions.includes(permission as BabyPermissionEnum)
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300'
              }`}
            >
              {formData.permissions.includes(permission as BabyPermissionEnum) && (
                <Text className='text-white text-sm font-bold'>✓</Text>
              )}
            </View>
            <View className='flex-1'>
              <Text className='text-base font-semibold text-gray-800 mb-1'>{label}</Text>
              <Text className='text-sm text-gray-500 leading-5'>
                {getPermissionDescription(permission as BabyPermissionEnum)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {formErrors.permissions && <Text className='text-xs text-red-500 mb-4'>{formErrors.permissions}</Text>}

      {/* Selected Count */}
      <View className='bg-green-50 p-3 rounded-xl'>
        <Text className='text-green-800 text-sm text-center font-medium'>
          {formData.permissions.length} permission{formData.permissions.length !== 1 ? 's' : ''} selected
        </Text>
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      className='bg-white rounded-2xl p-5 mx-4 shadow-lg'
    >
      <Text className='text-2xl font-bold text-gray-800 mb-2'>Review & Send</Text>
      <Text className='text-base text-gray-500 leading-6 mb-6'>
        Review the invitation details and add a personal message before sending.
      </Text>

      {/* Invitation Summary */}
      <View className='bg-gray-50 rounded-xl p-4 mb-5'>
        <Text className='text-lg font-bold text-gray-800 mb-3'>Invitation Summary</Text>

        <View className='flex flex-col gap-2'>
          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>Inviting:</Text>
            <Text className='font-semibold text-gray-800 flex-1 text-right'>{formData.email}</Text>
          </View>

          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>Relationship:</Text>
            <Text className='font-semibold text-gray-800 flex-1 text-right'>
              {RELATION_DISPLAY_NAMES[formData.relationType]}
              {formData.isPrimary && ' (Primary)'}
            </Text>
          </View>

          {formData.displayName && (
            <View className='flex-row justify-between'>
              <Text className='text-gray-600'>Display Name:</Text>
              <Text className='font-semibold text-gray-800 flex-1 text-right'>{formData.displayName}</Text>
            </View>
          )}

          <View className='flex-row justify-between'>
            <Text className='text-gray-600'>Permissions:</Text>
            <Text className='font-semibold text-blue-600 flex-1 text-right'>
              {formData.permissions.length} selected
            </Text>
          </View>
        </View>
      </View>

      {/* Personal Message */}
      <View className='mb-5'>
        <Text className='text-base font-semibold text-gray-800 mb-2'>Personal Message (Optional)</Text>
        <TextInput
          className='border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-white h-24'
          placeholder={`Hi! I'd like to invite you to be part of ${currentBaby?.name}'s family. This will help us stay connected and share precious moments together!`}
          placeholderTextColor='#999'
          value={formData.message}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, message: text }))}
          multiline
          numberOfLines={4}
          textAlignVertical='top'
        />
      </View>

      {/* What Happens Next */}
      <View className='bg-blue-50 p-4 rounded-xl'>
        <Text className='text-blue-800 font-semibold mb-2'>What happens next?</Text>
        <View className='flex flex-col gap-1'>
          <Text className='text-blue-700 text-sm'>• They'll receive an email invitation</Text>
          <Text className='text-blue-700 text-sm'>• They can accept or decline the invitation</Text>
          <Text className='text-blue-700 text-sm'>
            • Once accepted, they'll have access to {currentBaby?.name}'s profile
          </Text>
          <Text className='text-blue-700 text-sm'>• You can modify their permissions anytime</Text>
        </View>
      </View>
    </Animated.View>
  );

  if (!currentBaby) {
    return (
      <SafeAreaView className='flex-1 bg-gradient-to-br from-green-50 to-blue-50'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-gray-500'>Loading baby information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-gradient-to-br from-green-50 to-blue-50'>
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View className='flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200'>
          <TouchableOpacity onPress={handleCancel}>
            <Text className='text-red-500 text-base font-semibold'>Cancel</Text>
          </TouchableOpacity>

          <Text className='text-lg font-bold text-gray-800'>Invite to Family</Text>

          <View className='w-16' />
        </View>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Content */}
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          <View className='py-4'>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className='flex-row items-center px-4 py-3 bg-white border-t border-gray-200'>
          {currentStep > 1 && (
            <TouchableOpacity onPress={handleBack} className='bg-gray-100 px-4 py-3 rounded-xl'>
              <Text className='text-gray-600 font-semibold'>← Back</Text>
            </TouchableOpacity>
          )}

          <View className='flex-1' />

          {currentStep < 3 ? (
            <TouchableOpacity onPress={handleNext} className='bg-green-500 px-6 py-3 rounded-xl'>
              <Text className='text-white font-semibold'>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isSubmitting || isInviting}
              className={`px-6 py-3 rounded-xl ${isSubmitting || isInviting ? 'bg-gray-300' : 'bg-green-500'}`}
            >
              <Text className='text-white font-semibold'>
                {isSubmitting || isInviting ? 'Sending...' : 'Send Invitation'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InviteFamilyMemberScreen;
