import React from 'react';
import { View, Text, FlatList, StyleSheet, Button, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { EXPO_PUBLIC_BE_URL, EXPO_PUBLIC_BE_PORT } from '@env';
import { useSession } from '../context/SessionContext';

const TransactionsScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = React.useState(null);

  
  const { getToken } = useSession();
  
  // const handleTransactionDetails = (transactionId) => {
    //   navigation.navigate('TransactionDetails', { transactionId });
    // };
    
  
  const [selectedType, setSelectedType] = React.useState('All'); // Default selection
  
  const handleFilterChange = (itemValue) => {
    setSelectedType(itemValue);
  };


  // Fetch transaction data from my backend 
  const getTransactions = async () => {
    const token = await getToken();
    fetch(`${EXPO_PUBLIC_BE_URL}:${EXPO_PUBLIC_BE_PORT}/get-transactions?type=${selectedType.toLocaleLowerCase()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.transactions) {setTransactions(data.transactions);} else {setTransactions([]);}
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    getTransactions();
  }, [selectedType]);

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
        <Text style={{ textAlign: 'center', color: item.status === "pending" ? "#D6A600" : ["withdraw", "transfer"].includes(item.type) ? "red" : "green" }}>{["withdraw", "transfer"].includes(item.type) ? "-" : "+"} ${item.amount}</Text>
      </View>
      <View style={styles.cell}>
        <Text style={{ textAlign: 'center' }}>{item.date}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Transaction History</Text>
      {/* Select to filter by type */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterText}>Filter by:</Text>
        <View style={styles.pickerContainer}>

          <Picker
            selectedValue={selectedType}
            onValueChange={handleFilterChange}
          >
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Deposit" value="deposit" />
            <Picker.Item label="Withdraw" value="withdraw" />
            <Picker.Item label="Transfer" value="transfer" />
          </Picker>
        </View>
      </View>
      <View style={styles.tableContainer}>

        {/* Table Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Transaction ID</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Type</Text>
          <Text style={styles.headerCell}>Amount</Text>
          <Text style={styles.headerCell}>Date</Text>
        </View>
            {/* Transaction List or No Transactions Message */}
        {!transactions ? (
        <View style={styles.noTransactionsContainer}>
          <Text style={styles.noTransactionsMessage}>Loading ...</Text>
        </View>
        ) : transactions.length === 0 ? (
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
      </View>

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
    flexDirection: 'row',
    textAlign: "center",
    justifyContent: 'center',
    paddingVertical: 5,
    paddingBottom: 10,
    borderBottomWidth: 0.2,
  },
  listContainer: {
    flexGrow: 1,
  },
  tableContainer: {
    height: '75%',
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
  filterContainer: {
    flexDirection: 'row',
    margin: 5,
    padding: 3,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  filterText: {
    fontSize: 16,
    marginBottom: 3,
    fontWeight: 'bold',
  },
  pickerContainer: {
    height: 50,
    width: "43%",
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: 150,
  },
});

export default TransactionsScreen;
