import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {data} from "../global/todos";
import {Inter_500Medium, useFonts} from "@expo-google-fonts/inter"
import { ColorScheme, Theme, ThemeContext, ThemeProvider } from "@/context/ThemeContext";
import { Octicons } from "@expo/vector-icons";
import Animated, {LinearTransition} from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { TODO_APP_KEY } from "@/constants/Storage";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [loaded, error] = useFonts({ Inter_500Medium });
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext);
  const router = useRouter();

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

  const handlePress = (id: number) => {
    router.push({pathname: "/todos/[id]", params: {id}});
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const json = await AsyncStorage.getItem(TODO_APP_KEY);
        const storageTodos: Todo[] = json !== null ? JSON.parse(json) : null;

        if (storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id))
        } else {
          setTodos(data.sort((a, b) => b.id - a.id));
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchTodos();
  }, [data]);

  useEffect(() => {
    const storeTodos = async () => {
      try {
        await AsyncStorage.setItem(TODO_APP_KEY, JSON.stringify(todos));
      } catch (err) {
        console.error(err);
      }
    };

    storeTodos();
  }, [todos]);


  if (!loaded && !error) {
    return null
  }

  const styles = createStyles(theme, colorScheme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          maxLength={38}
          style={styles.input} 
          placeholder="Add a new todo" 
          placeholderTextColor="gray" 
          value={text} 
          onChangeText={setText}/>

        <Pressable onPress={addTodo} style={styles.addBt}>
          <Text style={styles.addBtText}>Add</Text>
        </Pressable>

        <Pressable 
          onPress={() => setColorScheme(color => color === "light" ? "dark" : "light")} 
          style={{marginLeft: 10}}>
            {colorScheme === "dark" ? (
              <Octicons name="moon" size={30} color={theme.text} style={{width: 30}} selectable={undefined}/>
            ) : (
              <Octicons name="sun" size={30} color={theme.text} style={{width: 30}} selectable={undefined}/>
            )}
        </Pressable>
      </View>

      <Animated.FlatList 
        data={todos} 
        keyExtractor={(todo) => todo.id.toString()}
        contentContainerStyle={{flex: 1}}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode="on-drag"
        renderItem={({item}) => (
          <View style={styles.todoItem}>
            <Pressable onPress={() => handlePress(item.id)} onLongPress={() => toogle(item.id)}>
              <Text 
              style={[styles.todoText, item.completed && styles.completedText]}>
                {item.title}
              </Text>
            </Pressable>
            
            <Pressable onPress={() => removeTodo(item.id)}>
              <MaterialCommunityIcons name="delete-circle" size={30} color="red"  selectable={undefined}/>
            </Pressable>
          </View>
        ) } 
      />
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"}/>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme, colorScheme: ColorScheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background
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
    fontFamily: "Inter_500Medium",
    minWidth: 0,
    color: theme.text
  },
  addBt: {
    backgroundColor: theme.button,
    borderRadius: 5,
    padding: 10
  },
  addBtText: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    color: colorScheme === "dark" ? "#000" : "#fff" 
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
    fontFamily: "Inter_500Medium",
    color: theme.text
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#ccc"
  }
})