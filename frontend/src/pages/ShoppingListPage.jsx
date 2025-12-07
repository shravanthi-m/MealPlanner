// Shopping List Page
import React, { useEffect } from "react";
import NavBar from "../components/NavBar";
import ShoppingListView from "../components/ShoppingListView";
import { useShoppingList } from "../hooks/useShoppingList";
import { getStoreValue } from "pulsy";
import "./ShoppingListPage.css";

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

  const handleDownloadPDF = async () => {
    try {
      const authStore = getStoreValue('auth');
      const token = authStore.token;
      
      const response = await fetch(`/api/shopping-list/pdf?weekStart=${encodeURIComponent(weekStart)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create a blob from the PDF response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shopping-list-${weekStart}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF. Please try again.');
    }
  };

  return (
    <div>
      <NavBar />
      <div className="shopping-page">
        <div className="shopping-card">
          <div className="shopping-header">
            <h2>Shopping List</h2>
            <p className="lead">Your weekly grocery list based on meal plan</p>
            <div className="controls">
              <button className="btn" onClick={handleDownloadPDF}>Download PDF</button>
            </div>
          </div>

          {loading && <div className="empty">Loading...</div>}
          {error && <div className="empty" style={{ color: "#b91c1c" }}>{error.message || error.toString()}</div>}

          {list ? (
            <div className="shopping-list">
              <ShoppingListView items={list.items} onCheck={checkItem} />
            </div>
          ) : (
            !loading && <div className="empty">No shopping list available for this week.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingListPage;
