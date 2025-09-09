
"use client";

import { jsPDF } from "jspdf";
import type { Path, PathModule, ModuleContent } from "@/data/pathsData";

// Helper function to add text with line breaks
const addTextWithBreaks = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
  const lines = doc.splitTextToSize(text.replace(/<br\s*\/?>/gi, '\n'), maxWidth);
  doc.text(lines, x, y);
  return lines.length * lineHeight;
};

// Helper function to safely process HTML content
const processHtml = (html: string): string => {
    if (typeof DOMParser === 'undefined') {
        // Fallback for non-browser environments (though this is client-side)
        return html.replace(/<[^>]+>/g, '');
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

export const generatePathPdf = async (path: Path) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'pt',
    format: 'a4'
  });

  const page = {
    width: doc.internal.pageSize.getWidth(),
    height: doc.internal.pageSize.getHeight(),
    margin: 40,
  };
  
  let y = page.margin;
  const lineHeight = 14;
  const headingLineHeight = 18;
  const contentWidth = page.width - 2 * page.margin;

  const checkAndAddPage = (requiredHeight: number) => {
    if (y + requiredHeight > page.height - page.margin) {
      doc.addPage();
      y = page.margin;
    }
  };
  
  // Path Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  checkAndAddPage(headingLineHeight * 2);
  y += addTextWithBreaks(doc, path.title, page.margin, y, contentWidth, headingLineHeight);
  y += 10;
  
  // Path Description
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100);
  checkAndAddPage(lineHeight * 2);
  y += addTextWithBreaks(doc, path.description, page.margin, y, contentWidth, lineHeight);
  doc.setTextColor(0);
  y += 20;
  
  // Iterate over modules
  for (const module of path.modules) {
    checkAndAddPage(headingLineHeight + 20);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 110, 140); // Accent color
    y += addTextWithBreaks(doc, module.title, page.margin, y, contentWidth, headingLineHeight);
    doc.setTextColor(0);
    y += 10;

    for (const content of module.content) {
      switch (content.type) {
        case 'title':
          checkAndAddPage(headingLineHeight);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          y += addTextWithBreaks(doc, content.text, page.margin, y, contentWidth, headingLineHeight);
          y += 5;
          break;
        case 'paragraph':
          checkAndAddPage(lineHeight * 2);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          y += addTextWithBreaks(doc, processHtml(content.text), page.margin, y, contentWidth, lineHeight);
          y += 10;
          break;
        case 'list':
          checkAndAddPage(lineHeight * content.items.length);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          for (const item of content.items) {
            checkAndAddPage(lineHeight);
            const processedItem = `• ${processHtml(item)}`;
            y += addTextWithBreaks(doc, processedItem, page.margin + 10, y, contentWidth - 10, lineHeight);
          }
          y += 10;
          break;
        case 'quote':
          checkAndAddPage(lineHeight * 2);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(150);
          y += addTextWithBreaks(doc, `"${content.text}"`, page.margin, y, contentWidth, lineHeight);
          doc.setTextColor(0);
          y += 10;
          break;
        case 'exercise':
        case 'therapeuticNotebookReflection':
          checkAndAddPage(headingLineHeight + lineHeight * 2);
          doc.setFillColor(240, 240, 240);
          doc.rect(page.margin - 5, y - 10, contentWidth + 10, 5, 'F');
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          y += addTextWithBreaks(doc, `EJERCICIO: ${content.title}`, page.margin, y, contentWidth, headingLineHeight);
          if ('objective' in content && content.objective) {
              doc.setFontSize(9);
              doc.setFont('helvetica', 'italic');
              y += addTextWithBreaks(doc, content.objective, page.margin, y, contentWidth, lineHeight);
          }
          y += 15;
          break;
      }
    }
    y += 20; // Extra space between modules
  }

  doc.save(`${path.title.replace(/ /g, '_')}.pdf`);
};
