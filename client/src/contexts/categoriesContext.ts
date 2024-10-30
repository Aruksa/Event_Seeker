import { createContext, useContext } from "react";
import { category } from "../types/category";

interface CategoriesContextProps {
  categories: category[];
  setCategories: React.Dispatch<React.SetStateAction<category[]>>;
}

export const CategoriesContext = createContext<
  CategoriesContextProps | undefined
>(undefined);

export function useCategoriesContext() {
  const context = useContext(CategoriesContext);

  if (context === undefined) {
    throw new Error(
      "useCategoriesContext must be used with a CategoriesContext"
    );
  }

  return context;
}
