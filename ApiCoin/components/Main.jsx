import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import { fetchApi } from "../api/fetch-api";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "./Card";

export function Main() {
  const [data, setData] = useState([]);

  const insets = useSafeAreaInsets();

  // Fetching data from the API
  useEffect(() => {
    fetchApi()
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>Api Coins exchanges</Text>
      </View>
      {data === null || data?.length === 0 ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <Card item={item} index={index} />
          )}
          keyExtractor={(item) => item.exchange_id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  mainText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  Container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
});
