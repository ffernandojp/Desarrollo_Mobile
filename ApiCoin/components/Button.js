import { StyleSheet, View, Pressable, Text, Linking } from "react-native";

export default function Button({ link, label }) {
  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => Linking.openURL(link)}
      >
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    margin: 5,
    width: 150,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    backgroundColor: "#E0E0E0",
  },
  button: {
    borderRadius: 10,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: "red",
    fontSize: 16,
  },
  buttonPressed: {
    opacity: 0.5,
    backgroundColor: "#99CCFF",
  },
});
