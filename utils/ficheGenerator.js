import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, HeadingLevel, Media } from "docx";

export async function generateFicheDocx({ nom, mois, annee, jours, vacations }) {
  const doc = new Document();

  // Charger le logo (fichier public/logo.png)
  const response = await fetch("/logo.png");
  const blob = await response.blob();
  const imageBuffer = await blob.arrayBuffer();
  const logoImage = Media.addImage(doc, imageBuffer);

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Nom")], width: { size: 25, type: "pct" } }),
          new TableCell({ children: [new Paragraph(nom)], width: { size: 75, type: "pct" } }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Mois / Année")] }),
          new TableCell({ children: [new Paragraph(`${mois} ${annee}`)] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Jours de vacation")] }),
          new TableCell({ children: [new Paragraph(jours.join(", "))] }),
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Nombre de vacations")] }),
          new TableCell({ children: [new Paragraph(vacations)] }),
        ]
      })
    ]
  });

  doc.addSection({
    properties: {},
    children: [
      new Paragraph({ children: [logoImage], alignment: AlignmentType.CENTER }),
      new Paragraph({
        text: "Fiche de Vacations",
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER
      }),
      new Paragraph(" "),
      table
    ]
  });

  const blobDoc = await Packer.toBlob(doc);
  saveAs(blobDoc, `Fiche_${mois}_${annee}.docx`);
}

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { saveAs } from "file-saver";

export async function generateFichePdf({ nom, mois, annee, jours, vacations }) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  const content = [
    `Fiche de Vacations`,
    ``,
    `Nom : ${nom}`,
    `Mois / Année : ${mois} ${annee}`,
    `Jours de vacation : ${jours.join(", ")}`,
    `Nombre de vacations : ${vacations}`
  ];

  content.forEach((line, i) => {
    page.drawText(line, {
      x: 50,
      y: height - 50 - i * 20,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  const pdfBytes = await pdfDoc.save();
  saveAs(new Blob([pdfBytes], { type: "application/pdf" }), `Fiche_${mois}_${annee}.pdf`);
}