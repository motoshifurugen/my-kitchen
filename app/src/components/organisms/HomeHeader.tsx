/**
 * Home Header (HUD-style)
 *
 * Fixed 72pt header with centered analog clock and subtle daily status.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Text } from '../atoms';
import { theme } from '../../tokens';

const HEADER_HEIGHT = 72;
const CLOCK_SIZE = 64;
const CLOCK_OVERHANG = 12;
const CLOCK_BORDER = 2;
const CLOCK_CENTER = CLOCK_SIZE / 2 - CLOCK_BORDER / 2;
const HOUR_HAND_LENGTH = CLOCK_SIZE / 2 - 12;
const MINUTE_HAND_LENGTH = CLOCK_SIZE / 2 - 8;
const SIDE_WIDTH = 120;

export type MealSlot = 'morning' | 'day' | 'night';

const SLOT_ICONS: Record<MealSlot, React.ComponentProps<typeof Icon>['name']> = {
  morning: 'SunHorizon',
  day: 'Sun',
  night: 'MoonStars',
};

export interface HomeHeaderProps {
  dateLabel: string;
  clockTime: Date;
  presentBuckets: MealSlot[];
  hasAnyTodayLogs: boolean;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  dateLabel,
  clockTime,
  presentBuckets,
  hasAnyTodayLogs,
}) => {
  const insets = useSafeAreaInsets();
  const minute = clockTime.getMinutes();
  const hour = clockTime.getHours() % 12;
  const hourAngle = hour * 30 + minute * 0.5;
  const minuteAngle = minute * 6;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text variant="caption" color={theme.colors.text.tertiary}>
            {dateLabel}
          </Text>
        </View>
        <View style={styles.centerSpacer} />
        <View style={styles.right}>
          <Text variant="caption" color={theme.colors.text.tertiary} style={styles.statusLabel}>
            今日の記録
          </Text>
          {!hasAnyTodayLogs || presentBuckets.length === 0 ? (
            <Text variant="caption" color={theme.colors.text.tertiary} numberOfLines={1}>
              まだ白紙です
            </Text>
          ) : (
            <View style={styles.statusIcons}>
              {presentBuckets.map((slot) => (
                <View key={slot} style={styles.statusIcon}>
                  <Icon
                    name={SLOT_ICONS[slot]}
                    size={18}
                    color={theme.colors.accent.primary}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={[styles.clockWrapper, { top: insets.top }]} pointerEvents="none">
        <View style={styles.clockFace}>
          {Array.from({ length: 12 }).map((_, index) => {
            const angle = (index / 12) * Math.PI * 2;
            const radius = CLOCK_SIZE / 2 - CLOCK_BORDER - 4;
            const x = CLOCK_CENTER + Math.sin(angle) * radius - 1.5;
            const y = CLOCK_CENTER - Math.cos(angle) * radius - 1.5;
            return <View key={index} style={[styles.clockTick, { left: x, top: y }]} />;
          })}

          <View
            style={[
              styles.handWrapper,
              {
                transform: [
                  { rotate: `${hourAngle}deg` },
                ],
              },
            ]}
          >
            <View style={styles.hourHand} />
          </View>
          <View
            style={[
              styles.handWrapper,
              {
                transform: [
                  { rotate: `${minuteAngle}deg` },
                ],
              },
            ]}
          >
            <View style={styles.minuteHand} />
          </View>
          <View style={styles.clockCenter} />
        </View>
      </View>
    </View>
  );
};

HomeHeader.displayName = 'HomeHeader';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  row: {
    height: HEADER_HEIGHT,
    paddingHorizontal: theme.spacing.screen.horizontal,
    flexDirection: 'row',
    alignItems: 'center',
  },
  left: {
    width: SIDE_WIDTH,
    paddingRight: theme.spacing.xs,
  },
  centerSpacer: {
    flex: 1,
  },
  right: {
    width: SIDE_WIDTH,
    alignItems: 'flex-end',
  },
  statusIcons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  statusLabel: {
    marginBottom: 2,
  },
  statusIcon: {
    width: 24,
    height: 24,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface.elevated,
  },
  clockWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    alignItems: 'center',
    height: HEADER_HEIGHT,
    paddingTop: 0,
  },
  clockFace: {
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
    borderRadius: CLOCK_SIZE / 2,
    backgroundColor: theme.colors.surface.elevated,
    borderWidth: CLOCK_BORDER,
    borderColor: theme.colors.accent.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
    marginTop: HEADER_HEIGHT - CLOCK_SIZE + CLOCK_OVERHANG,
  },
  clockTick: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.accent.primary,
    opacity: 0.6,
  },
  handWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: CLOCK_SIZE,
    height: CLOCK_SIZE,
  },
  hourHand: {
    position: 'absolute',
    width: 3,
    height: HOUR_HAND_LENGTH,
    backgroundColor: theme.colors.accent.primary,
    borderRadius: 2,
    left: CLOCK_CENTER - 1.5,
    top: CLOCK_CENTER - HOUR_HAND_LENGTH,
  },
  minuteHand: {
    position: 'absolute',
    width: 2,
    height: MINUTE_HAND_LENGTH,
    backgroundColor: theme.colors.accent.primary,
    borderRadius: 2,
    left: CLOCK_CENTER - 1,
    top: CLOCK_CENTER - MINUTE_HAND_LENGTH,
  },
  clockCenter: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent.primary,
    left: CLOCK_CENTER - 3,
    top: CLOCK_CENTER - 3,
  },
});
