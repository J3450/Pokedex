import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming
} from "react-native-reanimated";

const { width: SCREEN_W } = Dimensions.get("window");
const IS_MOBILE = SCREEN_W < 600;

// each pok slot size, card holds two side by side
const POK_SLOT = IS_MOBILE
  ? Math.min(SCREEN_W * 0.38, 160)
  : Math.min((SCREEN_W - 40) * 0.24, 110);
const GLASS_W = POK_SLOT * 2 + 16;
const GLASS_H = POK_SLOT + 16;

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: { type: { name: string; url: string } }[];
}

const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function darken(hex: string, amount = 0.45): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (num & 0xff) - Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Floating pokemon image with idle bob */
function BouncingPokemon({ uri, size = 140 }: { uri: string; size?: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 1000 }), // subtle — small amplitude, slow
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [uri]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.Image
      source={{ uri }}
      style={[{ width: size, height: size, resizeMode: "contain" }, style]}
    />
  );
}

/** Hero carousel */
function HeroSection({ pokemons }: { pokemons: Pokemon[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scaleBtn = useSharedValue(1);

  // all hooks before any conditional return
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleBtn.value }],
  }));

  // auto-advance every 3s
  useEffect(() => {
    if (pokemons.length === 0) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pokemons.length);
    }, 3000);
    return () => clearInterval(id);
  }, [pokemons.length]);

  const current = pokemons[activeIndex];
  if (!current) return null;

  const baseColor = colorsByType[current.types?.[0]?.type?.name] ?? "#A8A77A";
  const darkColor = darken(baseColor, 0.5);

  return (
    <LinearGradient
      colors={[baseColor, darkColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.hero, IS_MOBILE && styles.heroMobile]}
    >
      {IS_MOBILE ? (
        // ── Mobile: column layout ──────────────────
        <>
          {/* 1. Eyebrow + name */}
          <View style={styles.heroTopMobile}>
            <Text style={styles.heroEyebrow}>Pokédex</Text>
            <Text style={styles.heroName}>{current.name}</Text>
          </View>

          {/* 2. Glass card with images */}
          <BlurView intensity={50} tint="light" style={[styles.glassCard, styles.glassCardMobile]}>
            <View style={styles.carouselItem}>
              <BouncingPokemon uri={current.image} size={POK_SLOT} />
              <BouncingPokemon uri={current.imageBack} size={POK_SLOT} />
            </View>
          </BlurView>

          {/* 3. Type + button + dots */}
          <View style={styles.heroBottomMobile}>
            <Text style={styles.heroType}>{current.types?.[0]?.type?.name}</Text>
            <Link href={{ pathname: "/details", params: { name: current.name } }} asChild>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => { scaleBtn.value = withSpring(0.92, { damping: 12 }); }}
                onPressOut={() => { scaleBtn.value = withSpring(1, { damping: 12 }); }}
              >
                <Animated.View style={[styles.heroBtn, btnStyle]}>
                  <Text style={styles.heroBtnText}>View Pokémon →</Text>
                </Animated.View>
              </TouchableOpacity>
            </Link>
            <View style={styles.dots}>
              {pokemons.slice(
                Math.max(0, activeIndex - 2),
                Math.min(pokemons.length, activeIndex + 3)
              ).map((_, offset) => {
                const i = Math.max(0, activeIndex - 2) + offset;
                return (
                  <TouchableOpacity key={i} onPress={() => setActiveIndex(i)}>
                    <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      ) : (
        // ── Web/tablet: row layout ─────────────────
        <>
          <View style={styles.heroLeft}>
            <Text style={styles.heroEyebrow}>Pokédex</Text>
            <Text style={styles.heroName}>{current.name}</Text>
            <Text style={styles.heroType}>{current.types?.[0]?.type?.name}</Text>
            <Link href={{ pathname: "/details", params: { name: current.name } }} asChild>
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={() => { scaleBtn.value = withSpring(0.92, { damping: 12 }); }}
                onPressOut={() => { scaleBtn.value = withSpring(1, { damping: 12 }); }}
              >
                <Animated.View style={[styles.heroBtn, btnStyle]}>
                  <Text style={styles.heroBtnText}>View Pokémon →</Text>
                </Animated.View>
              </TouchableOpacity>
            </Link>
            <View style={styles.dots}>
              {pokemons.slice(
                Math.max(0, activeIndex - 2),
                Math.min(pokemons.length, activeIndex + 3)
              ).map((_, offset) => {
                const i = Math.max(0, activeIndex - 2) + offset;
                return (
                  <TouchableOpacity key={i} onPress={() => setActiveIndex(i)}>
                    <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.heroRight}>
            <BlurView intensity={50} tint="light" style={styles.glassCard}>
              <View style={styles.carouselItem}>
                <BouncingPokemon uri={current.image} size={POK_SLOT} />
                <BouncingPokemon uri={current.imageBack} size={POK_SLOT} />
              </View>
            </BlurView>
          </View>
        </>
      )}
    </LinearGradient>
  );
}

/** Pokemon list card */
function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const baseColor = colorsByType[pokemon.types?.[0]?.type?.name] ?? "#A8A77A";

  return (
    <Link href={{ pathname: "/details", params: { name: pokemon.name } }} asChild>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 12 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 12 }); }}
      >
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: baseColor + "30" },
            animStyle,
          ]}
        >
          <View style={styles.cardLeft}>
            <Text style={styles.cardName}>{pokemon.name}</Text>
            <View style={[styles.typeBadge, { backgroundColor: baseColor + "60" }]}>
              <Text style={styles.typeBadgeText}>{pokemon.types?.[0]?.type?.name}</Text>
            </View>
          </View>
          <View style={styles.cardImages}>
            <Image source={{ uri: pokemon.image }} style={styles.cardImg} />
            <Image source={{ uri: pokemon.imageBack }} style={styles.cardImg} />
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );
}

/** Footer */
function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Pokédex App</Text>
      <Text style={styles.footerSub}>Data from PokéAPI · Built by Joshua Rapu/Dickson</Text>
    </View>
  );
}

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchPokemons();
  }, []);

  async function fetchPokemons() {
    try {
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=20");
      const data = await response.json();
      const detailed = await Promise.all(
        data.results.map(async (p: any) => {
          const res = await fetch(p.url);
          const d = await res.json();
          return {
            name: p.name,
            image: d.sprites.front_default,
            imageBack: d.sprites.back_default,
            types: d.types,
          };
        })
      );
      setPokemons(detailed);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <HeroSection pokemons={pokemons} />

      {/* List */}
      <View style={styles.listSection}>
        <Text style={styles.sectionTitle}>All Pokémon</Text>
        {pokemons.map((p) => (
          <PokemonCard key={p.name} pokemon={p} />
        ))}
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 70, // check this 50 here fam (was 120, minus 50 = 70)
    paddingBottom: 40,
    gap: 0,
  },

  // ── Hero ──────────────────────────────────────────
  hero: {
    marginHorizontal: 20,
    borderRadius: 32,
    padding: 28,
    paddingVertical: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 300,
    overflow: "hidden",
  },
  heroMobile: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    paddingVertical: 32,
  },
  heroTopMobile: {
    alignSelf: "stretch",
    gap: 4,
  },
  heroBottomMobile: {
    alignSelf: "stretch",
    gap: 10,
  },
  glassCardMobile: {
    width: SCREEN_W - 96, // full hero width minus hero padding (28*2) and margin (20*2)
    height: GLASS_H * 1.4,
  },
  heroLeft: {
    flex: 1,
    gap: 8,
    paddingRight: 20,
    justifyContent: "center",
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  heroName: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    textTransform: "capitalize",
  },
  heroType: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.75)",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  heroBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignSelf: "flex-start",
  },
  heroBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: {
    width: 18,
    backgroundColor: "#fff",
  },

  // ── Glass card (right side) ───────────────────────
  heroRight: {
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  glassCard: {
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
    backgroundColor: "rgba(255,255,255,0.15)",
    width: GLASS_W,
    height: GLASS_H,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  // ── List section ──────────────────────────────────
  listSection: {
    marginTop: 36,
    paddingHorizontal: 20,
    gap: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 4,
  },

  // ── Card ──────────────────────────────────────────
  card: {
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  cardName: {
    fontSize: 20,
    fontWeight: "800",
    textTransform: "capitalize",
    color: "#1a1a1a",
  },
  typeBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "capitalize",
    color: "#1a1a1a",
  },
  cardImages: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImg: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },

  // ── Footer ────────────────────────────────────────
  footer: {
    marginTop: 48,
    marginHorizontal: 20,
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  footerSub: {
    fontSize: 12,
    color: "#999",
  },
});
