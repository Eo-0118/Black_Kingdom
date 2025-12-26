import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type ChipProps = {
  label: string;
  active?: boolean;
  onPress: () => void;
};

export default function Chip({ label, active, onPress }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: '#111827',
  },
  chipLabel: {
    fontSize: 12,
    color: '#374151',
  },
  chipLabelActive: {
    color: '#f9fafb',
    fontWeight: '600',
  },
});