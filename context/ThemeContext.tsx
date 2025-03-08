import { createContext, FC, PropsWithChildren, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

export type ColorScheme = "light" | "dark";
export type Theme = typeof Colors.light | typeof Colors.dark; 

interface ThemeCx {
  colorScheme: ColorScheme,
  theme: typeof Colors.light | typeof Colors.dark, 
  setColorScheme: React.Dispatch<React.SetStateAction<ColorScheme>>
}

export const ThemeContext = createContext<ThemeCx>({
  colorScheme: "dark",
  setColorScheme: () => {},
  theme: Colors.dark
});

export const ThemeProvider: FC<PropsWithChildren> = ({children}) => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());
  const theme = colorScheme == "dark" ? Colors.dark : Colors.light;

  return <ThemeContext.Provider value={{colorScheme, theme, setColorScheme} as unknown as ThemeCx } >{children}</ThemeContext.Provider>
};