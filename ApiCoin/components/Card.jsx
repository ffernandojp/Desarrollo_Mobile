import { StyleSheet, Text, View, Animated } from "react-native";
import Button from "./Button";

export function Card({ item }) {
  return (
    <View style={styles.card} key={item.exchange_id}>
      <Text style={styles.card.name}>
        {item.name}
      </Text>
      <Text style={styles.card.exchangesTitle}>
        Volume exchanges (USD)
      </Text>
      <View style={styles.card.exchangesContainer}>
      <Text style={styles.card.exchanges}>
        $ {item.volume_1hrs_usd.toFixed(2)} (hour)
      </Text>
      <Text style={styles.card.exchanges}>$ {item.volume_1day_usd.toFixed(2)} (day)</Text>
      </View>
      <Button link={item.website} label={"Go to Website"} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    marginVertical: 15,
    margin: 10,
    borderRadius: 20,
    width: 300,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    exchangesTitle: {
      fontWeight: "bold",
      fontSize: 16,
      margin: 5,
    },
    exchangesContainer: {
      margin: 5,
    },
    exchanges: {
      marginBottom: 5,
      fontSize: 15,
      color: "green",
    },
    website: {
      marginBottom: 5,
      fontSize: 15,
    },
    name: {
      fontWeight: "bold",
      fontSize: 20,
      margin: 5,
    },
  },
});
