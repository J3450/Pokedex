// import { BlurView } from "expo-blur";
// import { Stack, useRouter } from "expo-router";
// import { useEffect } from "react";
// import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
// import Animated, {
//     useAnimatedStyle,
//     useSharedValue,
//     withDelay,
//     withRepeat,
//     withSequence,
//     withSpring,
//     withTiming,
// } from "react-native-reanimated";

// const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// /** Reusable glass pill — BlurView is the root, animation on top */
// function GlassPill({
//   children,
//   style,
//   delay = 0,
// }: {
//   children: React.ReactNode;
//   style?: object;
//   delay?: number;
// }) {
//   const opacity = useSharedValue(0);
//   const translateY = useSharedValue(-12);

//   useEffect(() => {
//     opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
//     translateY.value = withDelay(
//       delay,
//       withSpring(0, { damping: 14, stiffness: 120 })
//     );
//   }, []);

//   const animStyle = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//     transform: [{ translateY: translateY.value }],
//   }));

//   return (
//     <AnimatedBlurView
//       intensity={80}
//       tint="light"
//       style={[styles.glassPill, style, animStyle]}
//     >
//       {children}
//     </AnimatedBlurView>
//   );
// }

// /** Bouncing logo pill for home screen */
// function LogoTitle() {
//   const translateY = useSharedValue(0);
//   const scale = useSharedValue(0.5);
//   const opacity = useSharedValue(0);

//   useEffect(() => {
//     opacity.value = withTiming(1, { duration: 300 });
//     scale.value = withSpring(1, { damping: 10, stiffness: 150 });
//     translateY.value = withDelay(
//       400,
//       withRepeat(
//         withSequence(
//           withTiming(-3, { duration: 900 }),
//           withTiming(0, { duration: 900 })
//         ),
//         -1,
//         true
//       )
//     );
//   }, []);

//   const pillStyle = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//     transform: [{ translateY: translateY.value }, { scale: scale.value }],
//   }));

//   return (
//     <AnimatedBlurView
//       intensity={80}
//       tint="light"
//       style={[styles.glassPill, styles.circle, { marginTop: 30 }, pillStyle]} // 30px here
//     >
//       <Image
//         source={require("../assets/images/android-icon-foreground.png")}
//         style={{ width: 34, height: 34, resizeMode: "contain" }}
//       />
//     </AnimatedBlurView>
//   );
// }

// /** Breadcrumb pill for details screen */
// function BreadcrumbTitle({ name }: { name: string }) {
//   return (
//     <GlassPill style={[styles.breadcrumb, { marginTop: 30 }]} delay={100}> {/* 30px here */}
//       <Text style={styles.breadcrumbText}>{name}</Text>
//     </GlassPill>
//   );
// }

// /** Back button pill with press scale animation */
// function BackButton() {
//   const router = useRouter();
//   const scale = useSharedValue(1);

//   const animStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: scale.value }],
//   }));

//   return (
//     <TouchableOpacity
//       onPress={() => router.back()}
//       onPressIn={() => {
//         scale.value = withSpring(0.88, { damping: 12, stiffness: 200 });
//       }}
//       onPressOut={() => {
//         scale.value = withSpring(1, { damping: 12, stiffness: 200 });
//       }}
//       activeOpacity={1}
//     >
//       <GlassPill style={[styles.circle, { marginTop: 30, marginLeft: 30 }]}> {/* 30px here */}
//         <Animated.View style={animStyle}>
//           <Text style={styles.backArrow}>‹</Text>
//         </Animated.View>
//       </GlassPill>
//     </TouchableOpacity>
//   );
// }

// export default function RootLayout() {
//   return (
//     <Stack>
//       <Stack.Screen
//         name="index"
//         options={{
//           headerTitle: () => <LogoTitle />,
//           headerTransparent: true,
//           headerBackground: () => null,
//           headerTitleAlign: "center",
//         }}
//       />
//       <Stack.Screen
//         name="details"
//         options={({ route }) => ({
//           headerBackVisible: false,
//           headerLeft: () => <BackButton />,
//           headerTitle: () => (
//             <BreadcrumbTitle name={(route.params as any)?.name ?? "Details"} />
//           ),
//           headerTitleAlign: "center",
//           headerLeftContainerStyle: { paddingLeft: 30 }, // 30px here
//           headerTransparent: true,
//           headerBackground: () => null,
//         })}
//       />
//     </Stack>
//   );
// }

// const styles = StyleSheet.create({
//   glassPill: {
//     overflow: "hidden",
//     borderRadius: 999,
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.6)",
//     backgroundColor: "rgba(255,255,255,0.18)",
//   },
//   circle: {
//     width: 54,
//     height: 54,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   breadcrumb: {
//     paddingHorizontal: 22,
//     paddingVertical: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   breadcrumbText: {
//     fontSize: 16,
//     fontWeight: "700",
//     textTransform: "capitalize",
//     color: "#1a1a1a",
//     letterSpacing: 0.3,
//   },
//   backArrow: {
//     fontSize: 32,
//     fontWeight: "300",
//     color: "#1a1a1a",
//     lineHeight: 36,
//     marginTop: -2,
//   },
// });

import { BlurView } from "expo-blur";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from "react-native-reanimated";

/** Reusable glass pill — Animated.View wraps BlurView */
function GlassPill({
  children,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: object;
  delay?: number;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-12);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(
      delay,
      withSpring(0, { damping: 14, stiffness: 120 })
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.glassPill, style, animStyle]}>
      <BlurView
        intensity={80}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </Animated.View>
  );
}

/** Bouncing logo pill for home screen */
function LogoTitle() {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
    translateY.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(-3, { duration: 900 }),
          withTiming(0, { duration: 900 })
        ),
        -1,
        true
      )
    );
  }, []);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.glassPill, styles.circle, { marginTop: 30 }, pillStyle]}>
      <BlurView
        intensity={80}
        tint="light"
        style={StyleSheet.absoluteFill}
      />
      <Image
        source={require("../assets/images/android-icon-foreground.png")}
        style={{ width: 34, height: 34, resizeMode: "contain" }}
      />
    </Animated.View>
  );
}

/** Breadcrumb pill for details screen */
function BreadcrumbTitle({ name }: { name: string }) {
  return (
    <GlassPill style={[styles.breadcrumb, { marginTop: 30 }]} delay={100}>
      <Text style={styles.breadcrumbText}>{name}</Text>
    </GlassPill>
  );
}

/** Back button pill with press scale animation */
function BackButton() {
  const router = useRouter();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      onPressIn={() => {
        scale.value = withSpring(0.88, { damping: 12, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      }}
      activeOpacity={1}
    >
      <GlassPill style={[styles.circle, { marginTop: 30, marginLeft: 30 }]}>
        <Animated.View style={animStyle}>
          <Text style={styles.backArrow}>‹</Text>
        </Animated.View>
      </GlassPill>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <LogoTitle />,
          headerTransparent: true,
          headerBackground: () => null,
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="details"
        options={({ route }) => ({
          headerBackVisible: false,
          headerLeft: () => <BackButton />,
          headerTitle: () => (
            <BreadcrumbTitle name={(route.params as any)?.name ?? "Details"} />
          ),
          headerTitleAlign: "center",
          headerLeftContainerStyle: { paddingLeft: 30 },
          headerTransparent: true,
          headerBackground: () => null,
        })}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  glassPill: {
    overflow: "hidden",
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  circle: {
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  breadcrumb: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  breadcrumbText: {
    fontSize: 16,
    fontWeight: "700",
    textTransform: "capitalize",
    color: "#1a1a1a",
    letterSpacing: 0.3,
  },
  backArrow: {
    fontSize: 32,
    fontWeight: "300",
    color: "#1a1a1a",
    lineHeight: 36,
    marginTop: -2,
  },
});