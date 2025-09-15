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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  // Form state
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
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
      const defaultPermissions = PERMISSION_SETS[formData.relationType as FamilyRelationTypeEnum] || [];
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
      errors.email = 'Email is required';
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
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      animateStepTransition();
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
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
      const result = await dispatch(
        inviteFamilyMember({
          babyId,
          invitationData: {
            email: formData.email,
            relationType: formData.relationType as FamilyRelationTypeEnum,
            displayName: formData.displayName || undefined,
            isPrimary: formData.isPrimary,
            permissions: formData.permissions,
            message: formData.message || undefined,
          },
        }),
      ).unwrap();

      Alert.alert(
        'Invitation Sent! 🎉',
        `We've sent an invitation to ${formData.email}. They'll receive an email with instructions to join ${currentBaby?.name}'s family.`,
        [
          {
            text: 'OK',
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

  const renderProgressIndicator = () => (
    <View className='px-4 py-3 bg-white'>
      <View className='h-1 bg-blue-100 rounded-sm mb-3'>
        <View className='h-full bg-blue-500 rounded-sm' style={{ width: `${(currentStep / 3) * 100}%` }} />
      </View>
      <View className='flex-row justify-between'>
        {[1, 2, 3].map((step) => (
          <View
            key={step}
            className={`w-8 h-8 rounded-2xl justify-center items-center ${currentStep >= step ? 'bg-blue-500' : 'bg-blue-100'}`}
          >
            <Text className={`text-sm font-bold ${currentStep >= step ? 'text-white' : 'text-gray-500'}`}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <Animated.View
      className='bg-white rounded-2xl p-5 shadow-lg'
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Text className='text-2xl font-bold text-gray-800 mb-2'>Contact Information</Text>
      <Text className='text-base text-gray-500 leading-6 mb-6'>
        Enter the email address and relationship type for the person you want to invite.
      </Text>

      {/* Email Input */}
      <View className='mb-5'>
        <Text className='text-base font-semibold text-gray-800 mb-2'>Email Address *</Text>
        <TextInput
          className={`border rounded-xl px-4 py-3 text-base text-gray-800 bg-white ${formErrors.email ? 'border-red-500' : 'border-gray-200'}`}
          placeholder='Enter email address'
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
          placeholder='How should they appear in the family?'
          placeholderTextColor='#999'
          value={formData.displayName}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, displayName: text }))}
        />
        <Text className='text-xs text-gray-400 mt-1'>e.g., "Grandma Sarah", "Uncle Mike", etc.</Text>
      </View>

      {/* Relationship Type */}
      <View className='mb-5'>
        <Text className='text-base font-semibold text-gray-800 mb-2'>Relationship Type *</Text>
        <View className='flex-row flex-wrap mt-2'>
          {Object.entries(RELATION_DISPLAY_NAMES).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              className={`px-3 py-2 rounded-2xl mr-2 mb-2 border ${formData.relationType === key ? 'bg-blue-500 border-blue-500' : 'bg-gray-50 border-gray-200'}`}
              onPress={() => {
                setFormData((prev) => ({ ...prev, relationType: key as FamilyRelationTypeEnum }));
                if (formErrors.relationType) {
                  setFormErrors((prev) => ({ ...prev, relationType: undefined }));
                }
              }}
            >
              <Text className={`text-sm font-medium ${formData.relationType === key ? 'text-white' : 'text-gray-800'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {formErrors.relationType && <Text className='text-xs text-red-500 mt-1'>{formErrors.relationType}</Text>}
      </View>

      {/* Primary Caregiver Toggle */}
      <View className='mb-5'>
        <TouchableOpacity
          className='flex-row items-start'
          onPress={() => setFormData((prev) => ({ ...prev, isPrimary: !prev.isPrimary }))}
        >
          <View
            className={`w-6 h-6 border-2 rounded-md justify-center items-center mr-3 mt-0.5 ${formData.isPrimary ? 'bg-blue-500 border-blue-500' : 'border-gray-200'}`}
          >
            {formData.isPrimary && <Text className='text-white text-base font-bold'>✓</Text>}
          </View>
          <View className='flex-1'>
            <Text className='text-base font-semibold text-gray-800 mb-1'>Primary Caregiver</Text>
            <Text className='text-sm text-gray-500 leading-5'>
              Primary caregivers have full access and cannot be removed by other family members.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      className='bg-white rounded-2xl p-5 shadow-lg'
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Text className='text-2xl font-bold text-gray-800 mb-2'>Permissions</Text>
      <Text className='text-base text-gray-500 leading-6 mb-6'>
        Choose what this family member can do with {currentBaby?.name}'s profile.
      </Text>

      {/* Recommended Permissions */}
      {formData.relationType && (
        <View className='bg-green-50 p-4 rounded-xl mb-5'>
          <Text className='text-base font-bold text-green-800 mb-1'>
            Recommended for {RELATION_DISPLAY_NAMES[formData.relationType as FamilyRelationTypeEnum]}:
          </Text>
          <Text className='text-sm text-green-800 leading-5'>
            We've pre-selected the most common permissions for this relationship. You can adjust them as needed.
          </Text>
        </View>
      )}

      {/* Permissions List */}
      <View className='mt-2'>
        {Object.entries(PERMISSION_DISPLAY_NAMES).map(([permission, label]) => (
          <TouchableOpacity
            key={permission}
            className='flex-row items-start py-3 border-b border-gray-100'
            onPress={() => togglePermission(permission as BabyPermissionEnum)}
          >
            <View
              className={`w-6 h-6 border-2 rounded-md justify-center items-center mr-3 mt-0.5 ${formData.permissions.includes(permission as BabyPermissionEnum) ? 'bg-blue-500 border-blue-500' : 'border-gray-200'}`}
            >
              {formData.permissions.includes(permission as BabyPermissionEnum) && (
                <Text className='text-white text-base font-bold'>✓</Text>
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

      {formErrors.permissions && <Text className='text-xs text-red-500 mt-1'>{formErrors.permissions}</Text>}
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View
      className='bg-white rounded-2xl p-5 shadow-lg'
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      <Text className='text-2xl font-bold text-gray-800 mb-2'>Personal Message</Text>
      <Text className='text-base text-gray-500 leading-6 mb-6'>
        Add a personal message to the invitation email (optional).
      </Text>

      {/* Message Input */}
      <View className='mb-5'>
        <Text className='text-base font-semibold text-gray-800 mb-2'>Invitation Message</Text>
        <TextInput
          className='border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 bg-white h-24'
          placeholder={`Hi! I'd like to invite you to be part of ${currentBaby?.name}'s family on our baby care app. This will help us all stay connected and share important updates about ${currentBaby?.name}'s growth and development.`}
          placeholderTextColor='#999'
          value={formData.message}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, message: text }))}
          multiline
          numberOfLines={4}
          textAlignVertical='top'
        />
      </View>

      {/* Invitation Summary */}
      <View className='bg-gray-50 p-4 rounded-xl mt-5'>
        <Text className='text-lg font-bold text-gray-800 mb-3'>Invitation Summary</Text>

        <View className='flex-row justify-between items-start mb-2'>
          <Text className='text-sm text-gray-500 flex-1'>Email:</Text>
          <Text className='text-sm font-semibold text-gray-800 flex-2 text-right'>{formData.email}</Text>
        </View>

        <View className='flex-row justify-between items-start mb-2'>
          <Text className='text-sm text-gray-500 flex-1'>Relationship:</Text>
          <Text className='text-sm font-semibold text-gray-800 flex-2 text-right'>
            {RELATION_DISPLAY_NAMES[formData.relationType as FamilyRelationTypeEnum]}
            {formData.isPrimary && ' (Primary Caregiver)'}
          </Text>
        </View>

        {formData.displayName && (
          <View className='flex-row justify-between items-start mb-2'>
            <Text className='text-sm text-gray-500 flex-1'>Display Name:</Text>
            <Text className='text-sm font-semibold text-gray-800 flex-2 text-right'>{formData.displayName}</Text>
          </View>
        )}

        <View className='flex-row justify-between items-start mb-2'>
          <Text className='text-sm text-gray-500 flex-1'>Permissions:</Text>
          <Text className='text-sm font-semibold text-gray-800 flex-2 text-right'>
            {formData.permissions.length} permission(s) selected
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const getPermissionDescription = (permission: BabyPermissionEnum): string => {
    const descriptions = {
      [BabyPermissionEnum.VIEW]: 'Can view basic baby information',
      [BabyPermissionEnum.VIEW_MEDICAL]: 'Can view medical information, allergies, and medications',
      [BabyPermissionEnum.EDIT]: 'Can edit basic information like name, birth date, etc.',
      [BabyPermissionEnum.EDIT_MEDICAL]: 'Can edit medical information and health records',
      [BabyPermissionEnum.DELETE]: 'Can delete the baby profile (use with caution)',
      [BabyPermissionEnum.MANAGE_FAMILY]: 'Can add or remove other family members',
      [BabyPermissionEnum.UPLOAD_MEDIA]: 'Can upload photos and videos',
      [BabyPermissionEnum.VIEW_ANALYTICS]: 'Can view growth charts and development analytics',
    };
    return descriptions[permission] || '';
  };

  if (!currentBaby) {
    return (
      <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-base text-gray-500'>Loading baby information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <KeyboardAvoidingView className='flex-1' behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View className='flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200'>
          <TouchableOpacity className='py-2' onPress={handleCancel}>
            <Text className='text-red-500 text-base font-semibold'>Cancel</Text>
          </TouchableOpacity>
          <Text className='text-lg font-bold text-gray-800'>Invite Family Member</Text>
          <View className='w-15' />
        </View>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Content */}
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          <View className='p-4'>
            <Text className='text-xl font-bold text-gray-800 text-center mb-6'>For {currentBaby.name}</Text>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className='flex-row items-center px-4 py-3 bg-white border-t border-gray-200'>
          {currentStep > 1 && (
            <TouchableOpacity className='px-4 py-3 rounded-lg bg-gray-50' onPress={handleBack}>
              <Text className='text-gray-500 text-base font-semibold'>← Back</Text>
            </TouchableOpacity>
          )}

          <View className='flex-1' />

          {currentStep < 3 ? (
            <TouchableOpacity className='bg-blue-500 px-6 py-3 rounded-lg' onPress={handleNext}>
              <Text className='text-white text-base font-semibold'>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className={`px-6 py-3 rounded-lg ${isSubmitting || isInviting ? 'bg-gray-300' : 'bg-green-500'}`}
              onPress={handleSubmit}
              disabled={isSubmitting || isInviting}
            >
              <Text className='text-white text-base font-semibold'>
                {isSubmitting || isInviting ? 'Sending...' : 'Send Invitation 📧'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getPermissionDescription = (permission: BabyPermissionEnum): string => {
  const descriptions = {
    [BabyPermissionEnum.VIEW]: 'Can view basic baby information',
    [BabyPermissionEnum.VIEW_MEDICAL]: 'Can view medical information, allergies, and medications',
    [BabyPermissionEnum.EDIT]: 'Can edit basic information like name, birth date, etc.',
    [BabyPermissionEnum.EDIT_MEDICAL]: 'Can edit medical information and health records',
    [BabyPermissionEnum.DELETE]: 'Can delete the baby profile (use with caution)',
    [BabyPermissionEnum.MANAGE_FAMILY]: 'Can add or remove other family members',
    [BabyPermissionEnum.UPLOAD_MEDIA]: 'Can upload photos and videos',
    [BabyPermissionEnum.VIEW_ANALYTICS]: 'Can view growth charts and development analytics',
  };
  return descriptions[permission] || '';
};

export default InviteFamilyMemberScreen;
