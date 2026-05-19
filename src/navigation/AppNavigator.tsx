import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

import { useApp } from '../context/AppContext';
import { Colors, Spacing, Typography } from '../theme';

import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import JournalScreen from '../screens/Journal/JournalScreen';
import TrackerScreen from '../screens/Tracker/TrackerScreen';
import ProgressScreen from '../screens/Progress/ProgressScreen';
import LearnScreen from '../screens/Learn/LearnScreen';
import PeersScreen from '../screens/Peers/PeersScreen';
import CHWScreen from '../screens/CHW/CHWScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS: Record<string, { icon: string; labelRw: string; labelEn: string }> = {
  Home: { icon: '🏠', labelRw: 'Ahabanza', labelEn: 'Home' },
  Journal: { icon: '📖', labelRw: 'Ibitabo', labelEn: 'Journal' },
  Tracker: { icon: '📊', labelRw: 'Gukurikirana', labelEn: 'Tracker' },
  Learn: { icon: '📚', labelRw: 'Kwiga', labelEn: 'Learn' },
  Peers: { icon: '🤝', labelRw: 'Inzira', labelEn: 'Circle' },
};

function TabBar({ state, descriptors, navigation }: any) {
  const { language } = useApp();
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const meta = TAB_ICONS[route.name];
          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };
          return (
            <View key={route.key} style={tabStyles.tabItem}>
              <View
                onTouchEnd={onPress}
                style={[tabStyles.tabBtn, isFocused && tabStyles.tabBtnActive]}
              >
                {isFocused && (
                  <LinearGradient
                    colors={[Colors.primaryLight, Colors.primary]}
                    style={tabStyles.activePill}
                  />
                )}
                <Text style={tabStyles.tabIcon}>{meta.icon}</Text>
              </View>
              <Text style={[tabStyles.tabLabel, isFocused && tabStyles.tabLabelActive]}>
                {language === 'rw' ? meta.labelRw : meta.labelEn}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Tracker" component={TrackerScreen} />
      <Tab.Screen name="Learn" component={LearnScreen} />
      <Tab.Screen name="Peers" component={PeersScreen} />
    </Tab.Navigator>
  );
}

function RootStack() {
  const { onboarded } = useApp();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!onboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Progress" component={ProgressScreen} options={{ presentation: 'card' }} />
          <Stack.Screen name="CHW" component={CHWScreen} options={{ presentation: 'card' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingBottom: 20,
    paddingTop: 8,
    shadowColor: '#1A2E25',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  bar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  tabBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabBtnActive: {},
  activePill: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    opacity: 0.15,
  },
  tabIcon: { fontSize: 22 },
  tabLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
