import PDFDocument from "pdfkit";
import ShoppingList from "../models/ShoppingList.js";

// Utility to generate PDF buffer from shopping list items
export function generateShoppingListPDF(items, weekStart) {
  const doc = new PDFDocument();
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(20).text(`Shopping List - Week of ${new Date(weekStart).toLocaleDateString()}`);
  doc.moveDown();

  // Group items by category
  const grouped = {};
  items.forEach(item => {
    const cat = item.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  });

  Object.keys(grouped).forEach(category => {
    doc.fontSize(16).text(category);
    grouped[category].forEach(item => {
      doc.fontSize(12).text(`- ${item.name} (${item.quantity} ${item.unit})`);
    });
    doc.moveDown();
  });

  doc.end();
  return new Promise((resolve, reject) => {
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on("error", reject);
  });
}

// Controller: GET /api/shopping-list/pdf?weekStart=...
export const getShoppingListPDF = async (req, res) => {
  try {
    const { weekStart } = req.query;
    const userId = req.user._id;
    const list = await ShoppingList.findOne({ userId, weekStart });
    if (!list) return res.status(404).json({ error: "Shopping list not found" });
    const pdfBuffer = await generateShoppingListPDF(list.items, weekStart);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=shopping-list-${weekStart}.pdf`
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
