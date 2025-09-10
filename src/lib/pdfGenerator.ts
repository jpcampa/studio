
"use client";

import { jsPDF } from "jspdf";
import type { Path, PathModule, ModuleContent } from "@/data/pathsData";

// Helper function to add text with line breaks and return the added height
const addTextWithBreaks = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return lines.length * lineHeight;
};

// Helper function to safely process HTML content, converting it to plain text
const processHtmlToText = (html: string): string => {
    // For client-side rendering, we can use the browser's DOM parser
    if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html.replace(/<br\s*\/?>/gi, '\n'), 'text/html');
        return doc.body.textContent || "";
    }
    // Basic fallback for non-browser environments (though this is a client component)
    return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
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

  const renderContentRecursive = (contentItem: ModuleContent) => {
    switch (contentItem.type) {
        case 'title':
            checkAndAddPage(headingLineHeight);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            y += addTextWithBreaks(doc, processHtmlToText(contentItem.text), page.margin, y, contentWidth, headingLineHeight);
            y += 5;
            break;
        case 'paragraph':
            checkAndAddPage(lineHeight * 2);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            y += addTextWithBreaks(doc, processHtmlToText(contentItem.text), page.margin, y, contentWidth, lineHeight);
            y += 10;
            break;
        case 'list':
            checkAndAddPage(lineHeight * contentItem.items.length);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            for (const item of contentItem.items) {
                checkAndAddPage(lineHeight);
                const processedItem = `• ${processHtmlToText(item)}`;
                y += addTextWithBreaks(doc, processedItem, page.margin + 10, y, contentWidth - 10, lineHeight);
            }
            y += 10;
            break;
        case 'quote':
            checkAndAddPage(lineHeight * 2);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'italic');
            doc.setTextColor(150);
            y += addTextWithBreaks(doc, `"${processHtmlToText(contentItem.text)}"`, page.margin, y, contentWidth, lineHeight);
            doc.setTextColor(0);
            y += 10;
            break;
        case 'collapsible':
            checkAndAddPage(headingLineHeight + 10);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            y += addTextWithBreaks(doc, `DESPLEGABLE: ${contentItem.title}`, page.margin, y, contentWidth, headingLineHeight);
            y += 5;
            // Recursively render content within the collapsible
            doc.setDrawColor(200);
            doc.line(page.margin, y, page.width - page.margin, y); // Separator line
            y += 10;
            contentItem.content.forEach(renderContentRecursive);
            doc.line(page.margin, y, page.width - page.margin, y); // Separator line
            y += 10;
            break;
        case 'exercise':
        case 'therapeuticNotebookReflection':
            checkAndAddPage(headingLineHeight + lineHeight * 3);
            doc.setFillColor(245, 245, 245);
            doc.rect(page.margin - 10, y - 12, contentWidth + 20, 50, 'F'); // Simple background for exercise
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 102, 153);
            y += addTextWithBreaks(doc, `EJERCICIO: ${contentItem.title}`, page.margin, y, contentWidth, headingLineHeight);
            doc.setTextColor(0);

            if ('objective' in contentItem && contentItem.objective) {
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                y += addTextWithBreaks(doc, contentItem.objective, page.margin, y, contentWidth, lineHeight);
            }

            if ('prompts' in contentItem && contentItem.prompts) {
                 doc.setFontSize(10);
                 doc.setFont('helvetica', 'normal');
                 contentItem.prompts.forEach(prompt => {
                    y += addTextWithBreaks(doc, `• ${prompt}`, page.margin + 10, y, contentWidth - 10, lineHeight);
                 });
            }
             if ('content' in contentItem && contentItem.content) {
                contentItem.content.forEach(renderContentRecursive);
            }

            y += 20; // Extra space after exercise
            break;
        // Add cases for all specific exercise types to ensure they are rendered correctly
        default:
             // Generic handler for all other exercise types
            if (contentItem.type.endsWith('Exercise') || contentItem.type.endsWith('Reflection')) {
                checkAndAddPage(headingLineHeight + lineHeight * 2);
                doc.setFillColor(245, 245, 245);
                doc.rect(page.margin - 10, y - 12, contentWidth + 20, 40, 'F');
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0, 102, 153);
                y += addTextWithBreaks(doc, `EJERCICIO: ${contentItem.title}`, page.margin, y, contentWidth, headingLineHeight);
                doc.setTextColor(0);

                if ('objective' in contentItem && contentItem.objective) {
                    doc.setFontSize(9);
                    doc.setFont('helvetica', 'italic');
                    y += addTextWithBreaks(doc, contentItem.objective, page.margin, y, contentWidth, lineHeight);
                }
                
                // Add placeholder for interactive part
                y += 5;
                doc.setFontSize(9);
                doc.setFont('helvetica', 'italic');
                doc.setTextColor(150);
                y += addTextWithBreaks(doc, "[Contenido interactivo para completar en la aplicación]", page.margin, y, contentWidth, lineHeight);
                doc.setTextColor(0);

                y += 20;
            }
            break;
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
    doc.setFillColor(230, 230, 230);
    doc.rect(0, y - 15, page.width, 3, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 110, 140);
    y += addTextWithBreaks(doc, module.title, page.margin, y, contentWidth, headingLineHeight);
    doc.setTextColor(0);
    y += 15;

    module.content.forEach(renderContentRecursive);
    
    y += 20; // Extra space between modules
  }

  doc.save(`${path.title.replace(/ /g, '_')}.pdf`);
};
