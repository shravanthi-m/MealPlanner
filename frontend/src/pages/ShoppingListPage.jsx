// Shopping List Page
import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import ShoppingListView from "../components/ShoppingListView";
import { useShoppingList } from "../hooks/useShoppingList";

const getWeekStartISO = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  return weekStart.toISOString().slice(0, 10); // YYYY-MM-DD
};

const ShoppingListPage = () => {
  const weekStart = getWeekStartISO();
  const { list, loading, error, checkItem, generateList } = useShoppingList(weekStart);

  // Automatically generate shopping list on mount
  useEffect(() => {
    generateList();
    // eslint-disable-next-line
  }, []);

  const handleDownloadPDF = () => {
    window.open(`/api/shopping-list/pdf?weekStart=${encodeURIComponent(weekStart)}`, "_blank");
  };

  return (
    <div>
      <NavBar />
      <h1>Shopping List</h1>
      <button onClick={handleDownloadPDF}>Download PDF</button>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error.message || error.toString()}</div>}
      {list && <ShoppingListView items={list.items} onCheck={checkItem} />}
    </div>
  );
};

export default ShoppingListPage;
