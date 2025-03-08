import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Todo } from "..";
import { SafeAreaView } from "react-native-safe-area-context";
import { ColorScheme, Theme, ThemeContext } from "@/context/ThemeContext";
import { TODO_APP_KEY } from "@/constants/Storage";

export default function EditScreen() {
  const {id} = useLocalSearchParams();
  const [todo, setTodo] = useState<Partial<Todo>>({});
  const router = useRouter();
  const [loaded, error] = useFonts({ Inter_500Medium });
  const {colorScheme, setColorScheme, theme} = useContext(ThemeContext);

  const handleSave = async () => {
    try {
      const savedTodo = {...todo, title: todo.title! };
      const json = await AsyncStorage.getItem(TODO_APP_KEY);
      const storageTodos: Todo[] = json !== null ? JSON.parse(json) : null;

      if (storageTodos && storageTodos.length) {
        const otherTodos = storageTodos.filter(todo => todo.id !== savedTodo.id);
        const allTodos = [...otherTodos, savedTodo];
        await AsyncStorage.setItem(TODO_APP_KEY, JSON.stringify(allTodos))
      } else {
        await AsyncStorage.setItem(TODO_APP_KEY, JSON.stringify([savedTodo]));
      }
      
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const styles = createStyles(theme, colorScheme);
  
  useEffect(() => {
    const fetchTodos = async (id: number) => {
      try {
        const json = await AsyncStorage.getItem(TODO_APP_KEY);
        const storageTodos: Todo[] = json !== null ? JSON.parse(json) : null;

        if (storageTodos && storageTodos.length) {
          const todo = storageTodos.find(todo => todo.id === id);
          setTodo(todo!);
        }
      } catch (err) {
        console.error(err)
      }
    };

    fetchTodos(+id);
  }, [id]);

  if (!loaded && !error) {
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput 
          maxLength={38}
          style={styles.input}
          placeholder="Edit todo"
          placeholderTextColor="#ccc"
          value={todo?.title ?? ""}
          onChangeText={(text) => setTodo((todo) => ({...todo, title: text}))} />

        <Pressable 
          onPress={() => setColorScheme((color: string) => color === "light" ? "dark" : "light")} 
          style={{marginLeft: 10}}>
            {colorScheme === "dark" ? (
              <Octicons name="moon" size={30} color={theme.text} style={{width: 30}} selectable={undefined}/>
            ) : (
              <Octicons name="sun" size={30} color={theme.text} style={{width: 30}} selectable={undefined}/>
            )}
        </Pressable>
      </View>

      <View style={styles.inputWrapper}>
        <Pressable onPress={handleSave} style={styles.saveBt}>
          <Text style={styles.saveBtText}>Save</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/")} style={[styles.saveBt, {backgroundColor: "red"}]}>
          <Text style={[styles.saveBtText, {color: "#fff"}]}>Cancel</Text>
        </Pressable>
      </View>

      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}


function createStyles(theme: Theme, colorScheme: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      backgroundColor: theme.background
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      gap: 6,
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
      padding: 10,
      marginLeft: 10,
      fontSize: 18,
      fontFamily: "Inter_500Medium",
      minWidth: 0,
      color: theme.text
    },
    saveBt: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10
    },
    saveBtText: {
      fontSize: 18,
      color: colorScheme === "dark" ? "#000" : "#fff"
    }
  });
}