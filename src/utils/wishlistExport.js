import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Export wishlist to PDF
 */
export const exportWishlistToPDF = (wishlist) => {
    try {
        console.log('Starting PDF export with', wishlist.length, 'games');

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setTextColor(6, 182, 212); // Cyan color
        doc.text('My Gaming Wishlist', 14, 20);

        // Add subtitle
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Total Games: ${wishlist.length}`, 14, 30);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 37);

        // Prepare table data
        const tableData = wishlist.map((game, index) => [
            index + 1,
            game.title || 'Unknown Game',
            game.category || game.genre || 'N/A',
            `₹${typeof game.price === 'number' ? game.price.toFixed(2) : parseFloat(game.price || 0).toFixed(2)}`,
            game.rating || '4.5'
        ]);

        console.log('Table data prepared:', tableData.length, 'rows');

        // Add table
        doc.autoTable({
            startY: 45,
            head: [['#', 'Game Title', 'Category', 'Price', 'Rating']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [6, 182, 212], // Cyan
                textColor: [255, 255, 255],
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: {
                textColor: [50, 50, 50]
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { cellWidth: 15, halign: 'center' },
                1: { cellWidth: 70 },
                2: { cellWidth: 40 },
                3: { cellWidth: 30, halign: 'right' },
                4: { cellWidth: 25, halign: 'center' }
            },
            margin: { top: 45 }
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
            doc.text(
                'GameHatch - Your Gaming Wishlist',
                14,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        // Save the PDF
        const filename = `GameHatch_Wishlist_${new Date().toISOString().split('T')[0]}.pdf`;
        console.log('Saving PDF as:', filename);
        doc.save(filename);
        console.log('PDF export completed successfully');
    } catch (error) {
        console.error('Error in exportWishlistToPDF:', error);
        throw error;
    }
};

/**
 * Export wishlist to Word document
 */
export const exportWishlistToWord = async (wishlist) => {
    // Create table rows
    const tableRows = [
        // Header row
        new TableRow({
            children: [
                new TableCell({
                    children: [new Paragraph({ text: '#', bold: true, alignment: AlignmentType.CENTER })],
                    shading: { fill: '06B6D4' }, // Cyan
                    width: { size: 10, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                    children: [new Paragraph({ text: 'Game Title', bold: true })],
                    shading: { fill: '06B6D4' },
                    width: { size: 40, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                    children: [new Paragraph({ text: 'Category', bold: true })],
                    shading: { fill: '06B6D4' },
                    width: { size: 20, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                    children: [new Paragraph({ text: 'Price', bold: true, alignment: AlignmentType.RIGHT })],
                    shading: { fill: '06B6D4' },
                    width: { size: 15, type: WidthType.PERCENTAGE }
                }),
                new TableCell({
                    children: [new Paragraph({ text: 'Rating', bold: true, alignment: AlignmentType.CENTER })],
                    shading: { fill: '06B6D4' },
                    width: { size: 15, type: WidthType.PERCENTAGE }
                })
            ]
        }),
        // Data rows
        ...wishlist.map((game, index) =>
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: String(index + 1), alignment: AlignmentType.CENTER })]
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: game.title || 'Unknown Game' })]
                    }),
                    new TableCell({
                        children: [new Paragraph({ text: game.category || game.genre || 'N/A' })]
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            text: `₹${typeof game.price === 'number' ? game.price.toFixed(2) : parseFloat(game.price || 0).toFixed(2)}`,
                            alignment: AlignmentType.RIGHT
                        })]
                    }),
                    new TableCell({
                        children: [new Paragraph({
                            text: game.rating || '4.5',
                            alignment: AlignmentType.CENTER
                        })]
                    })
                ]
            })
        )
    ];

    // Create document
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Title
                new Paragraph({
                    text: 'My Gaming Wishlist',
                    heading: HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                }),
                // Subtitle
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Total Games: ${wishlist.length}`,
                            bold: true
                        })
                    ],
                    spacing: { after: 100 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `Generated: ${new Date().toLocaleDateString()}`,
                            italics: true,
                            color: '666666'
                        })
                    ],
                    spacing: { after: 300 }
                }),
                // Table
                new Table({
                    rows: tableRows,
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE
                    }
                }),
                // Footer
                new Paragraph({
                    text: '',
                    spacing: { before: 400 }
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'GameHatch - Your Gaming Wishlist',
                            italics: true,
                            color: '999999',
                            size: 20
                        })
                    ],
                    alignment: AlignmentType.CENTER
                })
            ]
        }]
    });

    // Generate and save the document
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `GameHatch_Wishlist_${new Date().toISOString().split('T')[0]}.docx`);
};
