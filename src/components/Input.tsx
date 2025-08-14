// src/components/common/Input.tsx
import { useTheme } from '@/hooks/useTheme';
import React, { forwardRef } from 'react';
import { Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, helperText, containerStyle, labelStyle, inputStyle, leftIcon, rightIcon, ...props }, ref) => {
    const { colors } = useTheme();

    const getInputContainerStyle = (): ViewStyle => ({
      borderWidth: 1,
      borderColor: error ? colors.error : colors.border,
      borderRadius: 8,
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 12,
    });

    const getInputStyle = (): TextStyle => ({
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingHorizontal: leftIcon || rightIcon ? 8 : 0,
    });

    return (
      <View style={containerStyle}>
        {label && (
          <Text
            style={[
              {
                fontSize: 14,
                fontWeight: '500',
                color: colors.text,
                marginBottom: 8,
              },
              labelStyle,
            ]}
          >
            {label}
          </Text>
        )}

        <View style={getInputContainerStyle()}>
          {leftIcon}
          <TextInput
            ref={ref}
            style={[getInputStyle(), inputStyle]}
            placeholderTextColor={colors.textSecondary}
            {...props}
          />
          {rightIcon}
        </View>

        {(error || helperText) && (
          <Text
            style={{
              fontSize: 12,
              color: error ? colors.error : colors.textSecondary,
              marginTop: 4,
            }}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
