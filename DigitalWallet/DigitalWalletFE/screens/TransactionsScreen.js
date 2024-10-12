import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = React.useState([]);

  const { getToken } = useSession();

  // const handleTransactionDetails = (transactionId) => {
  //   navigation.navigate('TransactionDetails', { transactionId });
  // };

  // Fetch transaction data from my backend 
  const getTransactions = async () => {
    const token = await getToken();
    fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/get-transactions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    getTransactions();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable style={styles.row} key={item.transactionID} onPress={() => navigation.navigate('Payment', { amount: item.amount, transactionID: item.transactionID, status: item.status, id: item.id })}>
      <View style={styles.cell}>
        <Text style={{ textAlign: 'center' }}>{item.transactionID}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={{ textAlign: 'center', color: item.status === "success" ? "green" : item.status === "pending" ? "#D6A600" : "red" }}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>      
      </View>
      <View style={styles.cell}>
        <Text style={{ textAlign: 'center' }}>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={{ textAlign: 'center' }}>{item.amount}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={{ textAlign: 'center' }}>{item.date}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Transaction History</Text>
      
      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Transaction ID</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>Type</Text>
        <Text style={styles.headerCell}>Amount</Text>
        <Text style={styles.headerCell}>Date</Text>
      </View>
           {/* Transaction List or No Transactions Message */}
      {transactions.length === 0 ? (
        <View style={styles.noTransactionsContainer}>
          <Text style={styles.noTransactionsMessage}>No transactions available. Pay some money!</Text>
        </View>
      ) : (
        /* Transaction List */
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Button to go back to HomeScreen */}
      <View style={styles.buttonContainer}>
        <Button title="Back to Home" color={'#47b242'} onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  mainText: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 5,
    paddingBottom: 10,
    borderBottomWidth: 0.2,
  },
  listContainer: {
    flexGrow: 1,
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  noTransactionsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  noTransactionsMessage: {
    fontSize: 15,
    fontWeight: 'semibold',
    textAlign: 'center',
  },
});

export default TransactionsScreen;
