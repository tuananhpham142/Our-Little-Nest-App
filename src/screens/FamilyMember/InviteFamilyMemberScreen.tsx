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
    StyleSheet,
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
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      <View style={styles.stepIndicators}>
        {[1, 2, 3].map((step) => (
          <View key={step} style={[styles.stepIndicator, currentStep >= step && styles.stepIndicatorActive]}>
            <Text style={[styles.stepNumber, currentStep >= step && styles.stepNumberActive]}>{step}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>Contact Information</Text>
      <Text style={styles.stepDescription}>
        Enter the email address and relationship type for the person you want to invite.
      </Text>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address *</Text>
        <TextInput
          style={[styles.textInput, formErrors.email && styles.inputError]}
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
        {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
      </View>

      {/* Display Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Display Name (Optional)</Text>
        <TextInput
          style={styles.textInput}
          placeholder='How should they appear in the family?'
          placeholderTextColor='#999'
          value={formData.displayName}
          onChangeText={(text) => setFormData((prev) => ({ ...prev, displayName: text }))}
        />
        <Text style={styles.inputHint}>e.g., "Grandma Sarah", "Uncle Mike", etc.</Text>
      </View>

      {/* Relationship Type */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Relationship Type *</Text>
        <View style={styles.relationshipGrid}>
          {Object.entries(RELATION_DISPLAY_NAMES).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.relationshipChip, formData.relationType === key && styles.relationshipChipSelected]}
              onPress={() => {
                setFormData((prev) => ({ ...prev, relationType: key as FamilyRelationTypeEnum }));
                if (formErrors.relationType) {
                  setFormErrors((prev) => ({ ...prev, relationType: undefined }));
                }
              }}
            >
              <Text
                style={[
                  styles.relationshipChipText,
                  formData.relationType === key && styles.relationshipChipTextSelected,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {formErrors.relationType && <Text style={styles.errorText}>{formErrors.relationType}</Text>}
      </View>

      {/* Primary Caregiver Toggle */}
      <View style={styles.inputGroup}>
        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setFormData((prev) => ({ ...prev, isPrimary: !prev.isPrimary }))}
        >
          <View style={[styles.checkbox, formData.isPrimary && styles.checkboxChecked]}>
            {formData.isPrimary && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.checkboxContent}>
            <Text style={styles.checkboxLabel}>Primary Caregiver</Text>
            <Text style={styles.checkboxDescription}>
              Primary caregivers have full access and cannot be removed by other family members.
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>Permissions</Text>
      <Text style={styles.stepDescription}>
        Choose what this family member can do with {currentBaby?.name}'s profile.
      </Text>

      {/* Recommended Permissions */}
      {formData.relationType && (
        <View style={styles.recommendedSection}>
          <Text style={styles.recommendedTitle}>
            Recommended for {RELATION_DISPLAY_NAMES[formData.relationType as FamilyRelationTypeEnum]}:
          </Text>
          <Text style={styles.recommendedDescription}>
            We've pre-selected the most common permissions for this relationship. You can adjust them as needed.
          </Text>
        </View>
      )}

      {/* Permissions List */}
      <View style={styles.permissionsContainer}>
        {Object.entries(PERMISSION_DISPLAY_NAMES).map(([permission, label]) => (
          <TouchableOpacity
            key={permission}
            style={styles.permissionRow}
            onPress={() => togglePermission(permission as BabyPermissionEnum)}
          >
            <View
              style={[
                styles.checkbox,
                formData.permissions.includes(permission as BabyPermissionEnum) && styles.checkboxChecked,
              ]}
            >
              {formData.permissions.includes(permission as BabyPermissionEnum) && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <View style={styles.permissionContent}>
              <Text style={styles.permissionLabel}>{label}</Text>
              <Text style={styles.permissionDescription}>
                {getPermissionDescription(permission as BabyPermissionEnum)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {formErrors.permissions && <Text style={styles.errorText}>{formErrors.permissions}</Text>}
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.stepTitle}>Personal Message</Text>
      <Text style={styles.stepDescription}>Add a personal message to the invitation email (optional).</Text>

      {/* Message Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Invitation Message</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
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
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Invitation Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Email:</Text>
          <Text style={styles.summaryValue}>{formData.email}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Relationship:</Text>
          <Text style={styles.summaryValue}>
            {RELATION_DISPLAY_NAMES[formData.relationType as FamilyRelationTypeEnum]}
            {formData.isPrimary && ' (Primary Caregiver)'}
          </Text>
        </View>

        {formData.displayName && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Display Name:</Text>
            <Text style={styles.summaryValue}>{formData.displayName}</Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Permissions:</Text>
          <Text style={styles.summaryValue}>{formData.permissions.length} permission(s) selected</Text>
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading baby information...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invite Family Member</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Progress Indicator */}
        {renderProgressIndicator()}

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.babyName}>For {currentBaby.name}</Text>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}

          <View style={styles.footerSpacer} />

          {currentStep < 3 ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.submitButton, (isSubmitting || isInviting) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting || isInviting}
            >
              <Text style={styles.submitButtonText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  progressContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E3F2FD',
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicatorActive: {
    backgroundColor: '#007AFF',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  stepNumberActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  babyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#F44336',
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginTop: 4,
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  relationshipChip: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  relationshipChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  relationshipChipText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  relationshipChipTextSelected: {
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  checkboxDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recommendedSection: {
    backgroundColor: '#E8F5E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  recommendedDescription: {
    fontSize: 14,
    color: '#2E7D32',
    lineHeight: 20,
  },
  permissionsContainer: {
    marginTop: 8,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  permissionContent: {
    flex: 1,
  },
  permissionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summaryContainer: {
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  footerSpacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default InviteFamilyMemberScreen;
