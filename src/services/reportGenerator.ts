// Report generation utilities
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import type { PredictionResult, MedicalTestInput } from "../types";

export const generatePDFReport = (
  testValues: MedicalTestInput,
  result: PredictionResult,
  userName: string
): void => {
  const doc = new jsPDF();
  let yPos = 20;

  // Title
  doc.setFontSize(18);
  doc.text("Medi Report AI - Medical Analysis Report", 20, yPos);
  yPos += 10;

  // User info
  doc.setFontSize(12);
  doc.text(`Patient: ${userName}`, 20, yPos);
  yPos += 5;
  doc.text(`Report Date: ${result.testDate}`, 20, yPos);
  yPos += 15;

  // Test Values
  doc.setFontSize(14);
  doc.text("Blood Test Values", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);

  const testEntries = Object.entries(testValues);
  testEntries.forEach(([key, value]) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(
      `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`,
      25,
      yPos
    );
    yPos += 6;
  });

  yPos += 10;

  // Predictions
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(14);
  doc.text("Disease Risk Predictions", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);

  result.predictions.forEach((pred) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(12);
    doc.text(`${pred.disease} - ${pred.riskLevel} Risk`, 25, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.text(`Probability: ${(pred.probability * 100).toFixed(1)}%`, 30, yPos);
    yPos += 5;
    doc.text(pred.description, 30, yPos, { maxWidth: 160 });
    yPos += 10;
  });

  // Recommendations
  if (result.saltRecommendations.length > 0) {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(14);
    doc.text("Medication Recommendations", 20, yPos);
    yPos += 8;
    doc.setFontSize(10);

    result.saltRecommendations.forEach((rec) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(11);
      doc.text(`${rec.medicationName} (${rec.saltName})`, 25, yPos);
      yPos += 6;
      doc.setFontSize(10);
      doc.text(`Dosage: ${rec.dosage}`, 30, yPos);
      yPos += 5;
      doc.text(`Safe Starting Age: ${rec.safeStartingAge}+ years`, 30, yPos);
      yPos += 5;
      doc.text(`When Needed: ${rec.whenNeeded}`, 30, yPos);
      yPos += 8;
    });
  }

  // Diet Plan
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(14);
  doc.text("Diet Plan Recommendations", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.text("Foods to Eat:", 25, yPos);
  yPos += 6;
  result.dietPlan.foodsToEat.forEach((food) => {
    doc.text(`• ${food}`, 30, yPos);
    yPos += 5;
  });
  yPos += 3;
  doc.text("Foods to Avoid:", 25, yPos);
  yPos += 6;
  result.dietPlan.foodsToAvoid.forEach((food) => {
    doc.text(`• ${food}`, 30, yPos);
    yPos += 5;
  });

  // Recovery Timeline
  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(14);
  doc.text("Recovery Timeline", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.text(
    `Estimated Duration: ${result.recoveryTimeline.estimatedDuration}`,
    25,
    yPos
  );
  yPos += 8;
  doc.text("Milestones:", 25, yPos);
  yPos += 6;
  result.recoveryTimeline.milestones.forEach((milestone) => {
    doc.text(`Week ${milestone.week}: ${milestone.description}`, 30, yPos);
    yPos += 5;
  });

  // Save PDF
  doc.save(`MediReport_${result.testDate}_${userName.replace(/\s/g, "_")}.pdf`);
};

export const generateExcelReport = (
  testValues: MedicalTestInput,
  result: PredictionResult,
  userName: string
): void => {
  const workbook = XLSX.utils.book_new();

  // Test Values Sheet
  const testData = Object.entries(testValues).map(([key, value]) => ({
    Parameter:
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    Value: value,
  }));
  const testSheet = XLSX.utils.json_to_sheet(testData);
  XLSX.utils.book_append_sheet(workbook, testSheet, "Test Values");

  // Predictions Sheet
  const predictionsData = result.predictions.map((pred) => ({
    Disease: pred.disease,
    "Risk Level": pred.riskLevel,
    "Probability (%)": (pred.probability * 100).toFixed(1),
    Description: pred.description,
  }));
  const predictionsSheet = XLSX.utils.json_to_sheet(predictionsData);
  XLSX.utils.book_append_sheet(workbook, predictionsSheet, "Predictions");

  // Recommendations Sheet
  if (result.saltRecommendations.length > 0) {
    const recommendationsData = result.saltRecommendations.map((rec) => ({
      "Medication Name": rec.medicationName,
      "Salt Name": rec.saltName,
      Dosage: rec.dosage,
      "Safe Starting Age": rec.safeStartingAge,
      "When Needed": rec.whenNeeded,
      Cautions: rec.cautions.join("; "),
    }));
    const recommendationsSheet = XLSX.utils.json_to_sheet(recommendationsData);
    XLSX.utils.book_append_sheet(workbook, recommendationsSheet, "Medications");
  }

  // Diet Plan Sheet
  const dietData = [
    { Category: "Foods to Eat", Items: result.dietPlan.foodsToEat.join("; ") },
    {
      Category: "Foods to Avoid",
      Items: result.dietPlan.foodsToAvoid.join("; "),
    },
    {
      Category: "Healthy Routines",
      Items: result.dietPlan.healthyRoutines.join("; "),
    },
    { Category: "Duration", Items: result.dietPlan.duration },
  ];
  const dietSheet = XLSX.utils.json_to_sheet(dietData);
  XLSX.utils.book_append_sheet(workbook, dietSheet, "Diet Plan");

  // Recovery Timeline Sheet
  const timelineData: Array<{ Week: string | number; Description: string }> =
    result.recoveryTimeline.milestones.map((milestone) => ({
      Week: milestone.week,
      Description: milestone.description,
    }));
  timelineData.unshift({
    Week: "Estimated Duration",
    Description: result.recoveryTimeline.estimatedDuration,
  });
  const timelineSheet = XLSX.utils.json_to_sheet(timelineData);
  XLSX.utils.book_append_sheet(workbook, timelineSheet, "Recovery Timeline");

  // Save Excel
  XLSX.writeFile(
    workbook,
    `MediReport_${result.testDate}_${userName.replace(/\s/g, "_")}.xlsx`
  );
};
