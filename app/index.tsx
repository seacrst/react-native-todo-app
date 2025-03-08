import { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {data} from "../global/todos";

export default function() {
  const [todos, setTodos] = useState(data.sort((a, b) => b.id - a.id));
  const [text, setText] = useState("");

  const addTodo = () => {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([
        {
          id: newId,
          title: text,
          completed: false
        },
        ...todos
      ]);
      setText("");
    }
  };

  const toogle = (id: number) => {
    setTodos(todos.map(todo => todo.id === id ? {...todo, completed: !todo.completed} : todo));
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput 
          style={styles.input} 
          placeholder="Add a new todo" 
          placeholderTextColor="gray" 
          value={text} 
          onChangeText={setText}/>

        <Pressable onPress={addTodo} style={styles.addBt}>
          <Text style={styles.addBtText}>Add</Text>
        </Pressable>
      </View>

      <FlatList 
        data={todos} 
        keyExtractor={(todo) => todo.id.toString()}
        contentContainerStyle={{flex: 1}}
        renderItem={({item}) => (
          <View style={styles.todoItem}>
            <Text 
            style={[styles.todoText, item.completed && styles.completedText]}
            onPress={() => toogle(item.id)} >
              {item.title}
            </Text>
            
            <Pressable onPress={() => removeTodo(item.id)}>
              <MaterialCommunityIcons name="delete-circle" size={30} color="red"  selectable={undefined}/>
            </Pressable>
          </View>
        ) } 
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: "100%",
    backgroundColor: "#000"
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto"
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    padding: 10,
    fontSize: 18,
    minWidth: 0,
    color: "#fff"
  },
  addBt: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10
  },
  addBtText: {
    fontSize: 18,
    color: "#000"
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    width: "100%",
    maxWidth: 1024,
    marginHorizontal: "auto",
    pointerEvents: "auto"
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    color: "#fff"
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#ccc"
  }
})