// Report generation utilities
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import type { PredictionResult, MedicalTestInput } from "../types";
import { NORMAL_RANGES } from "../utils/constants";

/** Optional context shown on exported reports (PDF/Excel). */
export type ReportExportOptions = {
  userEmail?: string;
  reportId?: string;
};

const LAB_KEYS = Object.keys(NORMAL_RANGES) as (keyof MedicalTestInput)[];

function humanizeParamKey(key: string): string {
  const labels: Partial<Record<keyof MedicalTestInput, string>> = {
    glucose: "Glucose",
    urea: "Urea",
    creatinine: "Creatinine",
    hemoglobin: "Hemoglobin",
    platelets: "Platelets",
    wbc: "White Blood Cells (WBC)",
    rbc: "Red Blood Cells (RBC)",
    alt: "ALT",
    ast: "AST",
    bilirubin: "Bilirubin",
    albumin: "Albumin",
    sodium: "Sodium",
    potassium: "Potassium",
    cholesterol: "Total Cholesterol",
    hdl: "HDL Cholesterol",
    ldl: "LDL Cholesterol",
    triglycerides: "Triglycerides",
  };
  return labels[key as keyof MedicalTestInput] ?? key;
}

function formatLabNumeric(key: keyof MedicalTestInput, value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (key === "platelets" || key === "wbc") {
    return Math.round(value).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  }
  const rounded =
    Math.abs(value - Math.round(value)) < 1e-9
      ? String(Math.round(value))
      : value.toFixed(2).replace(/\.?0+$/, "");
  return rounded;
}

function rangeStatus(
  key: keyof MedicalTestInput,
  value: number
): "Within range" | "Below range" | "Above range" {
  const r = NORMAL_RANGES[key];
  if (!Number.isFinite(value)) return "Within range";
  if (value < r.min) return "Below range";
  if (value > r.max) return "Above range";
  return "Within range";
}

function buildLabRows(testValues: MedicalTestInput) {
  return LAB_KEYS.map((key) => {
    const r = NORMAL_RANGES[key];
    const value = testValues[key];
    return {
      key,
      parameter: humanizeParamKey(key),
      valueRaw: value,
      valueFormatted: formatLabNumeric(key, value),
      unit: r.unit,
      normalRange: `${r.min}–${r.max} ${r.unit}`,
      status: rangeStatus(key, value),
    };
  });
}

function appendPdfMeta(
  doc: jsPDF,
  yStart: number,
  userName: string,
  result: PredictionResult,
  opts: ReportExportOptions
): number {
  let y = yStart;
  doc.setFontSize(10);
  if (opts.userEmail) {
    doc.text(`Email: ${opts.userEmail}`, 20, y);
    y += 5;
  }
  if (opts.reportId) {
    doc.text(`Report ID: ${opts.reportId}`, 20, y);
    y += 5;
  }
  if (result.userId) {
    doc.text(`User ID: ${result.userId}`, 20, y);
    y += 5;
  }
  if (result.mlOverallRisk) {
    doc.text(`ML overall risk hint: ${result.mlOverallRisk}`, 20, y);
    y += 5;
  }
  if (result.learning) {
    doc.text(
      `Learning — model active: ${result.learning.mlModelActive ? "yes" : "no"}, samples logged: ${result.learning.trainingSamplesLogged}`,
      20,
      y,
      { maxWidth: 170 }
    );
    y += 8;
  }
  return y + 5;
}

export const generatePDFReport = (
  testValues: MedicalTestInput,
  result: PredictionResult,
  userName: string,
  opts: ReportExportOptions = {}
): void => {
  const doc = new jsPDF();
  let yPos = 20;

  doc.setFontSize(18);
  doc.text("Medi Report AI - Medical Analysis Report", 20, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.text(`Patient: ${userName}`, 20, yPos);
  yPos += 5;
  doc.text(`Report date: ${result.testDate}`, 20, yPos);
  yPos += 8;

  yPos = appendPdfMeta(doc, yPos, userName, result, opts);

  doc.setFontSize(14);
  doc.text("Laboratory parameters", 20, yPos);
  yPos += 8;
  doc.setFontSize(9);

  const rows = buildLabRows(testValues);
  rows.forEach((row) => {
    if (yPos > 268) {
      doc.addPage();
      yPos = 20;
    }
    const line = `${row.parameter}: ${row.valueFormatted} ${row.unit} | Normal: ${row.normalRange} | ${row.status}`;
    doc.text(line, 23, yPos, { maxWidth: 167 });
    yPos += Math.max(
      5,
      doc.getTextDimensions(line, { maxWidth: 167 }).h + 2
    );
  });

  yPos += 8;

  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(14);
  doc.text("Disease risk predictions", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);

  result.predictions.forEach((pred) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(12);
    doc.text(`${pred.disease} — ${pred.riskLevel} risk`, 23, yPos);
    yPos += 6;
    doc.setFontSize(10);
    doc.text(`Probability: ${(pred.probability * 100).toFixed(1)}%`, 28, yPos);
    yPos += 5;
    doc.text(pred.description, 28, yPos, { maxWidth: 162 });
    yPos += Math.max(
      8,
      doc.getTextDimensions(pred.description, { maxWidth: 162 }).h + 3
    );
  });

  if (result.saltRecommendations.length > 0) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(14);
    doc.text("Medication recommendations", 20, yPos);
    yPos += 8;
    doc.setFontSize(10);

    result.saltRecommendations.forEach((rec) => {
      if (yPos > 268) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(11);
      doc.text(`${rec.medicationName} (${rec.saltName})`, 23, yPos);
      yPos += 6;
      doc.setFontSize(10);
      doc.text(`Dosage: ${rec.dosage}`, 28, yPos);
      yPos += 5;
      doc.text(`Safe starting age: ${rec.safeStartingAge}+`, 28, yPos);
      yPos += 5;
      doc.text(`When needed: ${rec.whenNeeded}`, 28, yPos, { maxWidth: 162 });
      yPos +=
        Math.max(
          5,
          doc.getTextDimensions(rec.whenNeeded, { maxWidth: 162 }).h + 2
        ) + 2;
      if (rec.cautions?.length) {
        doc.text("Cautions:", 28, yPos);
        yPos += 5;
        rec.cautions.forEach((c) => {
          if (yPos > 272) {
            doc.addPage();
            yPos = 20;
          }
          doc.text(`• ${c}`, 33, yPos, { maxWidth: 157 });
          yPos += Math.max(5, doc.getTextDimensions(`• ${c}`, { maxWidth: 157 }).h + 1);
        });
      }
      yPos += 4;
    });
  }

  if (yPos > 200) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(14);
  doc.text("Diet plan", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.text("Foods to eat:", 23, yPos);
  yPos += 6;
  result.dietPlan.foodsToEat.forEach((food) => {
    if (yPos > 272) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(`• ${food}`, 28, yPos);
    yPos += 5;
  });
  yPos += 3;
  doc.text("Foods to avoid:", 23, yPos);
  yPos += 6;
  result.dietPlan.foodsToAvoid.forEach((food) => {
    if (yPos > 272) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(`• ${food}`, 28, yPos);
    yPos += 5;
  });
  if (result.dietPlan.healthyRoutines?.length) {
    yPos += 3;
    doc.text("Healthy routines:", 23, yPos);
    yPos += 6;
    result.dietPlan.healthyRoutines.forEach((line) => {
      if (yPos > 272) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`• ${line}`, 28, yPos, { maxWidth: 162 });
      yPos += Math.max(5, doc.getTextDimensions(`• ${line}`, { maxWidth: 162 }).h + 1);
    });
  }
  if (result.dietPlan.duration) {
    yPos += 4;
    doc.text(`Suggested duration: ${result.dietPlan.duration}`, 23, yPos);
    yPos += 8;
  }
  const meal = result.dietPlan.mealPlan;
  if (
    meal &&
    (meal.breakfast?.length ||
      meal.lunch?.length ||
      meal.dinner?.length ||
      meal.snacks?.length)
  ) {
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }
    doc.setFontSize(12);
    doc.text("Sample meal plan", 23, yPos);
    yPos += 6;
    doc.setFontSize(10);
    const blocks: [string, string[]][] = [
      ["Breakfast", meal.breakfast ?? []],
      ["Lunch", meal.lunch ?? []],
      ["Dinner", meal.dinner ?? []],
      ["Snacks", meal.snacks ?? []],
    ];
    blocks.forEach(([title, items]) => {
      if (!items.length) return;
      if (yPos > 268) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${title}: ${items.join(", ")}`, 28, yPos, { maxWidth: 162 });
      yPos += Math.max(
        6,
        doc.getTextDimensions(`${title}: ${items.join(", ")}`, { maxWidth: 162 }).h + 3
      );
    });
    yPos += 4;
  }

  if (yPos > 220) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(14);
  doc.text("Recovery timeline", 20, yPos);
  yPos += 8;
  doc.setFontSize(10);
  doc.text(
    `Estimated duration: ${result.recoveryTimeline.estimatedDuration}`,
    23,
    yPos
  );
  yPos += 6;
  doc.text(
    `Estimated improvement indicator: ${result.recoveryTimeline.improvementPercentage}%`,
    23,
    yPos
  );
  yPos += 8;
  doc.text("Milestones:", 23, yPos);
  yPos += 6;
  result.recoveryTimeline.milestones.forEach((milestone) => {
    if (yPos > 272) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(`Week ${milestone.week}: ${milestone.description}`, 28, yPos, {
      maxWidth: 162,
    });
    yPos += Math.max(
      5,
      doc.getTextDimensions(`Week ${milestone.week}: ${milestone.description}`, {
        maxWidth: 162,
      }).h + 2
    );
  });

  yPos += 8;
  if (yPos > 265) {
    doc.addPage();
    yPos = 20;
  }
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    "Disclaimer: Medi Report AI provides informational insights only and does not replace professional medical diagnosis or treatment.",
    20,
    yPos,
    { maxWidth: 170 }
  );

  doc.setTextColor(0);
  doc.save(`MediReport_${result.testDate}_${userName.replace(/\s/g, "_")}.pdf`);
};

export const generateExcelReport = (
  testValues: MedicalTestInput,
  result: PredictionResult,
  userName: string,
  opts: ReportExportOptions = {}
): void => {
  const workbook = XLSX.utils.book_new();

  const reportInfoRows = [
    { Field: "Patient name", Value: userName },
    ...(opts.userEmail ? [{ Field: "Email", Value: opts.userEmail }] : []),
    ...(opts.reportId ? [{ Field: "Report ID", Value: opts.reportId }] : []),
    { Field: "Report date", Value: result.testDate },
    ...(result.userId ? [{ Field: "User ID", Value: result.userId }] : []),
    ...(result.mlOverallRisk
      ? [{ Field: "ML overall risk (hint)", Value: result.mlOverallRisk }]
      : []),
    ...(result.learning
      ? [
          {
            Field: "ML model active",
            Value: result.learning.mlModelActive ? "Yes" : "No",
          },
          {
            Field: "Training samples logged",
            Value: String(result.learning.trainingSamplesLogged),
          },
        ]
      : []),
  ];
  const infoSheet = XLSX.utils.json_to_sheet(reportInfoRows);
  XLSX.utils.book_append_sheet(workbook, infoSheet, "Report info");

  const labRows = buildLabRows(testValues).map((r) => ({
    Parameter: r.parameter,
    Value: r.valueFormatted,
    Unit: r.unit,
    "Normal range": r.normalRange,
    Status: r.status,
  }));
  const testSheet = XLSX.utils.json_to_sheet(labRows);
  XLSX.utils.book_append_sheet(workbook, testSheet, "Lab parameters");

  const predictionsData = result.predictions.map((pred) => ({
    Disease: pred.disease,
    "Risk level": pred.riskLevel,
    "Probability (%)": (pred.probability * 100).toFixed(1),
    Description: pred.description,
  }));
  const predictionsSheet = XLSX.utils.json_to_sheet(predictionsData);
  XLSX.utils.book_append_sheet(workbook, predictionsSheet, "Predictions");

  if (result.saltRecommendations.length > 0) {
    const recommendationsData = result.saltRecommendations.map((rec) => ({
      "Medication name": rec.medicationName,
      "Salt name": rec.saltName,
      Dosage: rec.dosage,
      "Safe starting age": rec.safeStartingAge,
      "When needed": rec.whenNeeded,
      Cautions: rec.cautions.join("; "),
    }));
    const recommendationsSheet = XLSX.utils.json_to_sheet(recommendationsData);
    XLSX.utils.book_append_sheet(workbook, recommendationsSheet, "Medications");
  }

  const dietSheetRows: { Category: string; Details: string }[] = [
    {
      Category: "Foods to eat",
      Details: result.dietPlan.foodsToEat.join("; "),
    },
    {
      Category: "Foods to avoid",
      Details: result.dietPlan.foodsToAvoid.join("; "),
    },
    {
      Category: "Healthy routines",
      Details: (result.dietPlan.healthyRoutines ?? []).join("; "),
    },
    {
      Category: "Duration",
      Details: result.dietPlan.duration,
    },
  ];

  const meal = result.dietPlan.mealPlan;
  if (meal) {
    if (meal.breakfast?.length)
      dietSheetRows.push({
        Category: "Meal plan — breakfast",
        Details: meal.breakfast.join("; "),
      });
    if (meal.lunch?.length)
      dietSheetRows.push({
        Category: "Meal plan — lunch",
        Details: meal.lunch.join("; "),
      });
    if (meal.dinner?.length)
      dietSheetRows.push({
        Category: "Meal plan — dinner",
        Details: meal.dinner.join("; "),
      });
    if (meal.snacks?.length)
      dietSheetRows.push({
        Category: "Meal plan — snacks",
        Details: meal.snacks.join("; "),
      });
  }

  const dietSheet = XLSX.utils.json_to_sheet(dietSheetRows);
  XLSX.utils.book_append_sheet(workbook, dietSheet, "Diet plan");

  const timelineRows: { Item: string; Detail: string }[] = [
    {
      Item: "Estimated duration",
      Detail: result.recoveryTimeline.estimatedDuration,
    },
    {
      Item: "Improvement indicator (%)",
      Detail: String(result.recoveryTimeline.improvementPercentage),
    },
  ];
  result.recoveryTimeline.milestones.forEach((m) => {
    timelineRows.push({
      Item: `Week ${m.week}`,
      Detail: m.description,
    });
  });
  const timelineSheet = XLSX.utils.json_to_sheet(timelineRows);
  XLSX.utils.book_append_sheet(workbook, timelineSheet, "Recovery timeline");

  const disclaimerSheet = XLSX.utils.json_to_sheet([
    {
      Note:
        "Medi Report AI provides informational insights only and does not replace professional medical diagnosis or treatment.",
    },
  ]);
  XLSX.utils.book_append_sheet(workbook, disclaimerSheet, "Disclaimer");

  XLSX.writeFile(
    workbook,
    `MediReport_${result.testDate}_${userName.replace(/\s/g, "_")}.xlsx`
  );
};
