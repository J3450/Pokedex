// import { Stack, useLocalSearchParams } from "expo-router";
// import { useEffect, useState } from "react";
// import { ScrollView, Text, View, Image, StyleSheet } from "react-native";

// interface PokemonDetails {
//   name: string;
//   image: string;
//   imageBack: string;
//   types: { type: { name: string } }[];
//   abilities: { ability: { name: string } }[];
//   height: number;
//   weight: number;
//   stats: { base_stat: number; stat: { name: string } }[];
// }


// export default function Details() {
//   const params = useLocalSearchParams();
//   const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);


//   useEffect(() => {
//       fetchPokemonsBynames(name as string);
//   }, [])

//   async function fetchPokemonsBynames(name: string) {
//     try{
//       const response = await fetch(
//         `https://pokeapi.co/api/v2/pokemon/${name}`
//       );
//       const res = await fetch(name.url);
//       const details = await res.json();

//       setPokemon({
//         name: details.name,
//         image: details.sprites.front_default,
//         imageBack: details.sprites.back_default,
//         types: details.types,
//         abilities: details.abilities,
//         height: details.height,
//         weight: details.weight,
//         stats: details.stats,
//       });


//     } catch (e){
//        console.log(e)
//     }

//   }


//   return (
//     <>
//       <Stack.Screen options={{ title: params.name as string}}/>
//         <ScrollView contentContainerStyle={{gap: 16, padding: 16}}>
//            pokemon && (
//            <View>
//                 {/* Images */}
//                 <View style={{ flexDirection: "row" }}>
//                 <Image source={{ uri: pokemon.image }} style={{ width: 150, height: 150 }} />
//                 <Image source={{ uri: pokemon.imageBack }} style={{ width: 150, height: 150 }} />
//                 </View>

//                 {/* Types */}
//                 <Text>Types: {pokemon.types.map(t => t.type.name).join(", ")}</Text>

//                 {/* Abilities */}
//                 <Text>Abilities: {pokemon.abilities.map(a => a.ability.name).join(", ")}</Text>

//                 {/* Height & Weight */}
//                 <Text>Height: {pokemon.height / 10}m</Text>
//                 <Text>Weight: {pokemon.weight / 10}kg</Text>

//                 {/* Stats */}
//                 {pokemon.stats.map((s) => (
//                 <Text key={s.stat.name}>{s.stat.name}: {s.base_stat}</Text>
//             </View>
//             )
        
//         </ScrollView>
//     </>
//   );
// }


// const styles = StyleSheet.create({
  
// });

import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, Image, StyleSheet } from "react-native";

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

export default function Details() {
  const { name } = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    fetchPokemonsByNames(name as string);
  }, []);

  async function fetchPokemonsByNames(name: string) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const details = await response.json(); // ✅ use response not a second fetch

      setPokemon({
        name: details.name,
        image: details.sprites.front_default,
        imageBack: details.sprites.back_default,
        types: details.types,
        abilities: details.abilities,
        height: details.height,
        weight: details.weight,
        stats: details.stats,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: name as string }} />
      <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}>
        {pokemon && ( // ✅ wrapped in {}
          <View>
            {/* Images */}
            <View style={{ flexDirection: "row" }}>
              <Image source={{ uri: pokemon.image }} style={{ width: 150, height: 150 }} />
              <Image source={{ uri: pokemon.imageBack }} style={{ width: 150, height: 150 }} />
            </View>

            {/* Types */}
            <Text>Types: {pokemon.types.map(t => t.type.name).join(", ")}</Text>
           

            {/* Abilities */}
            <Text>Abilities: {pokemon.abilities.map(a => a.ability.name).join(", ")}</Text>

            {/* Height & Weight */}
            <Text>Height: {pokemon.height / 10}m</Text>
            <Text>Weight: {pokemon.weight / 10}kg</Text>

            {/* Stats */}
            {pokemon.stats.map((s) => (
              <Text key={s.stat.name}>{s.stat.name}: {s.base_stat}</Text>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );

}

const styles = StyleSheet.create({
  //  name : {
  //   fontSize: 30,
  //   fontWeight: 'bold',
  //   textAlign: 'center'
  // },

 });