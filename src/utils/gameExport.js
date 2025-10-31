import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, Media, AlignmentType, Table, TableCell, TableRow, WidthType } from 'docx';
    
// Utility function to generate PDF for game card
export const generateGamePDF = async (game, wishlistData = null) => {
  const pdf = new jsPDF();

  // Add title
  pdf.setFontSize(20);
  pdf.setTextColor(59, 130, 246); // Blue color
  pdf.text(game.title, 20, 30);

  // Add game details
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);

  let yPosition = 50;

  // Game information
  const gameInfo = [
    ['Genre:', game.genre],
    ['Developer:', game.developer || 'N/A'],
    ['Publisher:', game.publisher || 'N/A'],
    ['Rating:', `${game.rating}/5`],
    ['Platforms:', game.platforms?.join(', ') || 'N/A'],
    ['Price:', `₹${typeof game.price === 'number' ? game.price.toFixed(2) : parseFloat(game.price || 0).toFixed(2)}`],
  ];

  if (game.discount) {
    gameInfo.push(['Discount:', `${game.discount}% OFF`]);
    gameInfo.push(['Final Price:', `₹${typeof game.price === 'number' ? (game.price * (1 - game.discount / 100)).toFixed(2) : parseFloat((game.price || 0) * (1 - game.discount / 100)).toFixed(2)}`]);
  }

  // Add wishlist information if available
  if (wishlistData) {
    gameInfo.push(['Wishlist Status:', 'In Your Wishlist']);
    if (wishlistData.addedAt) {
      const addedDate = new Date(wishlistData.addedAt).toLocaleDateString();
      gameInfo.push(['Added to Wishlist:', addedDate]);
    }
  }

  gameInfo.forEach(([label, value]) => {
    pdf.setFont(undefined, 'bold');
    pdf.text(label, 20, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.text(value, 80, yPosition);
    yPosition += 10;
  });

  // Add description
  if (game.description) {
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    const splitDescription = pdf.splitTextToSize(`Description: ${game.description}`, 170);
    pdf.text(splitDescription, 20, yPosition);
  }

  // Add tags if available
  if (game.tags && game.tags.length > 0) {
    yPosition += 30;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Tags:', 20, yPosition);
    yPosition += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text(game.tags.join(', '), 20, yPosition);
  }

  // Add footer
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pdf.internal.pageSize.height - 20);

  // Save the PDF
  pdf.save(`${game.title.replace(/[^a-zA-Z0-9]/g, '_')}_Game_Card.pdf`);
};

// Utility function to generate DOCX for game card
export const generateGameDOCX = async (game, wishlistData = null) => {
  const children = [];

  // Title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: game.title,
          size: 32,
          bold: true,
          color: '3B82F6', // Blue color
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400,
      },
    })
  );

  // Game details table
  const tableRows = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Property', bold: true })] })],
          width: { size: 25, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Details', bold: true })] })],
          width: { size: 75, type: WidthType.PERCENTAGE },
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun('Genre')] })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun(game.genre)] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun('Developer')] })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun(game.developer || 'N/A')] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun('Publisher')] })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun(game.publisher || 'N/A')] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun('Rating')] })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun(`${game.rating}/5`)] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun('Platforms')] })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun(game.platforms?.join(', ') || 'N/A')] })],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun('Price')] })],
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun(`₹${typeof game.price === 'number' ? game.price.toFixed(2) : parseFloat(game.price || 0).toFixed(2)}`)] })],
        }),
      ],
    }),
  ];

  if (game.discount) {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun('Discount')] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun(`${game.discount}% OFF`)] })],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun('Final Price')] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun(`₹${typeof game.price === 'number' ? (game.price * (1 - game.discount / 100)).toFixed(2) : parseFloat((game.price || 0) * (1 - game.discount / 100)).toFixed(2)}`)] })],
          }),
        ],
      })
    );
  }

  // Add wishlist information if available
  if (wishlistData) {
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun('Wishlist Status')] })],
          }),
          new TableCell({
            children: [new Paragraph({ children: [new TextRun('In Your Wishlist')] })],
          }),
        ],
      })
    );

    if (wishlistData.addedAt) {
      const addedDate = new Date(wishlistData.addedAt).toLocaleDateString();
      tableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun('Added to Wishlist')] })],
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun(addedDate)] })],
            }),
          ],
        })
      );
    }
  }

  children.push(
    new Table({
      rows: tableRows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
    })
  );

  // Description
  if (game.description) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '\nDescription:',
            bold: true,
            size: 24,
          }),
        ],
        spacing: {
          before: 400,
          after: 200,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: game.description,
            size: 22,
          }),
        ],
        spacing: {
          after: 400,
        },
      })
    );
  }

  // Tags
  if (game.tags && game.tags.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: '\nTags:',
            bold: true,
            size: 24,
          }),
        ],
        spacing: {
          before: 400,
          after: 200,
        },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: game.tags.join(', '),
            size: 22,
          }),
        ],
        spacing: {
          after: 400,
        },
      })
    );
  }

  // Footer
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated on ${new Date().toLocaleDateString()}`,
          size: 16,
          color: '999999',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: {
        before: 400,
      },
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  // Generate and save the document
  Packer.toBlob(doc).then((blob) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${game.title.replace(/[^a-zA-Z0-9]/g, '_')}_Game_Card.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  });
};

// Utility function to handle download with format selection
export const downloadGameCard = async (game, format = 'pdf', wishlistData = null) => {
  try {
    if (format === 'pdf') {
      await generateGamePDF(game, wishlistData);
    } else if (format === 'docx') {
      await generateGameDOCX(game, wishlistData);
    } else {
      throw new Error('Unsupported format. Use "pdf" or "docx"');
    }
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
};
