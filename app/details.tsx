import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface PokemonDetails {
  name: string;
  image: string;
  imageBack: string;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  height: number;
  weight: number;
  stats: { base_stat: number; stat: { name: string } }[];
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

/** Read-only input-style info row */
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldInput}>
        <Text style={styles.fieldValue}>{value}</Text>
      </View>
    </View>
  );
}

/** Stat row with label, bar, and number */
function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const pct = Math.min(value / 160, 1); // max meaningful stat ~160
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statBarBg}>
        <View
          style={[
            styles.statBarFill,
            { width: `${pct * 100}%` as any, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

export default function Details() {
  const { name } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    fetchPokemon(name as string);
  }, []);

  async function fetchPokemon(name: string) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const d = await res.json();
      setPokemon({
        name: d.name,
        image: d.sprites.front_default,
        imageBack: d.sprites.back_default,
        types: d.types,
        abilities: d.abilities,
        height: d.height,
        weight: d.weight,
        stats: d.stats,
      });
    } catch (e) {
      console.log(e);
    }
  }

  const typeColor = pokemon
    ? (colorsByType[pokemon.types?.[0]?.type?.name] ?? "#6366f1")
    : "#6366f1";

  return (
    <>
      <Stack.Screen options={{}} />

      {/* Background — radial gradient on web, LinearGradient on native */}
      {Platform.OS === "web" ? (
        <View
          style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
          pointerEvents="none"
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                background: `radial-gradient(125% 125% at 50% 90%, #fff 40%, ${typeColor} 100%)`,
              } as any,
            ]}
          />
        </View>
      ) : (
        <LinearGradient
          colors={["#ffffff", typeColor + "55", typeColor + "99"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFill, { zIndex: -1 }]}
          pointerEvents="none"
        />
      )}

      <ScrollView
        contentContainerStyle={styles.page}
        showsVerticalScrollIndicator={false}
      >
        {pokemon && (
          <>
            {/* ── Hero images ── */}
            <View style={styles.imagesRow}>
              <Image source={{ uri: pokemon.image }} style={styles.pokImg} />
              <Image source={{ uri: pokemon.imageBack }} style={styles.pokImg} />
            </View>

            {/* ── Name + type badge ── */}
            <View style={styles.nameRow}>
              <Text style={styles.pokName}>{pokemon.name}</Text>
              <View style={[styles.typeBadge, { backgroundColor: typeColor + "30" }]}>
                <Text style={[styles.typeBadgeText, { color: typeColor }]}>
                  {pokemon.types.map((t) => t.type.name).join(" · ")}
                </Text>
              </View>
            </View>

            {/* ── Info fields ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Info</Text>
              <View style={styles.fieldsGrid}>
                <InfoField
                  label="Types"
                  value={pokemon.types.map((t) => t.type.name).join(", ")}
                />
                <InfoField
                  label="Abilities"
                  value={pokemon.abilities.map((a) => a.ability.name).join(", ")}
                />
                <InfoField label="Height" value={`${pokemon.height / 10} m`} />
                <InfoField label="Weight" value={`${pokemon.weight / 10} kg`} />
              </View>
            </View>

            {/* ── Stats ── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Base Stats</Text>
              <View style={styles.statsCard}>
                {pokemon.stats.map((s) => (
                  <StatRow
                    key={s.stat.name}
                    label={s.stat.name}
                    value={s.base_stat}
                    color={typeColor}
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 110,
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 28,
  },

  // ── Images ────────────────────────────────────────
  imagesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  pokImg: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },

  // ── Name ──────────────────────────────────────────
  nameRow: {
    alignItems: "center",
    gap: 8,
  },
  pokName: {
    fontSize: 34,
    fontWeight: "800",
    textTransform: "capitalize",
    color: "#1a1a1a",
  },
  typeBadge: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  typeBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  // ── Section ───────────────────────────────────────
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },

  // ── Info fields ───────────────────────────────────
  fieldsGrid: {
    gap: 10,
  },
  field: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#aaa",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingLeft: 4,
  },
  fieldInput: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.07)",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
    textTransform: "capitalize",
  },

  // ── Stats card ────────────────────────────────────
  statsCard: {
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.07)",
    padding: 20,
    gap: 14,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "capitalize",
    width: 110,
  },
  statBarBg: {
    flex: 1,
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  statBarFill: {
    height: "100%",
    borderRadius: 999,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a1a",
    width: 32,
    textAlign: "right",
  },
});
