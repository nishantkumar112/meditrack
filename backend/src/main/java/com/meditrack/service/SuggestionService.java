package com.meditrack.service;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SuggestionService {

    private static final List<String> MEDICINE_NAMES = List.of(
        "Aspirin", "Ibuprofen", "Paracetamol", "Acetaminophen", "Amoxicillin",
        "Metformin", "Atorvastatin", "Omeprazole", "Amlodipine", "Metoprolol",
        "Losartan", "Albuterol", "Gabapentin", "Sertraline", "Tramadol",
        "Warfarin", "Furosemide", "Hydrochlorothiazide", "Pantoprazole", "Simvastatin",
        "Levothyroxine", "Azithromycin", "Ciprofloxacin", "Doxycycline", "Cephalexin",
        "Prednisone", "Diazepam", "Lorazepam", "Clonazepam", "Alprazolam",
        "Codeine", "Morphine", "Oxycodone", "Hydrocodone", "Naproxen",
        "Celecoxib", "Diclofenac", "Meloxicam", "Indomethacin", "Ketorolac",
        "Insulin", "Glipizide", "Glimepiride", "Pioglitazone", "Sitagliptin",
        "Lisinopril", "Enalapril", "Ramipril", "Captopril", "Benazepril",
        "Atenolol", "Propranolol", "Carvedilol", "Bisoprolol", "Nebivolol",
        "Amlodipine", "Nifedipine", "Diltiazem", "Verapamil", "Felodipine",
        "Digoxin", "Furosemide", "Spironolactone", "Eplerenone", "Triamterene",
        "Montelukast", "Fluticasone", "Budesonide", "Beclomethasone", "Salmeterol",
        "Cetirizine", "Loratadine", "Fexofenadine", "Diphenhydramine", "Chlorpheniramine",
        "Ranitidine", "Famotidine", "Cimetidine", "Nizatidine", "Esomeprazole",
        "Lansoprazole", "Rabeprazole", "Dexlansoprazole", "Calcium Carbonate", "Magnesium Hydroxide"
    );

    private static final List<String> MEDICAL_TESTS = List.of(
        "Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)", "Comprehensive Metabolic Panel (CMP)",
        "Lipid Panel", "Liver Function Tests (LFT)", "Thyroid Function Tests (TFT)",
        "Hemoglobin A1C (HbA1c)", "Blood Glucose (Fasting)", "Blood Glucose (Random)",
        "Urinalysis", "Chest X-Ray", "Electrocardiogram (EKG/ECG)", "Echocardiogram",
        "Stress Test", "CT Scan", "MRI Scan", "Ultrasound", "Mammogram",
        "Pap Smear", "Prostate-Specific Antigen (PSA)", "Vitamin D Level",
        "Vitamin B12 Level", "Iron Studies", "Ferritin", "Bone Density Scan (DEXA)",
        "Colonoscopy", "Endoscopy", "Sigmoidoscopy", "Biopsy", "Culture and Sensitivity",
        "Blood Type", "Rh Factor", "Coagulation Panel", "PT/INR", "APTT",
        "D-Dimer", "Troponin", "BNP", "Creatinine", "BUN (Blood Urea Nitrogen)",
        "eGFR", "Uric Acid", "Calcium", "Phosphorus", "Magnesium",
        "Sodium", "Potassium", "Chloride", "CO2", "Albumin",
        "Total Protein", "Bilirubin (Total)", "Bilirubin (Direct)", "AST (SGOT)",
        "ALT (SGPT)", "Alkaline Phosphatase", "GGT", "LDH", "Amylase",
        "Lipase", "CRP (C-Reactive Protein)", "ESR (Erythrocyte Sedimentation Rate)",
        "TSH", "Free T4", "Free T3", "Total T4", "Total T3",
        "Cortisol", "Testosterone", "Estrogen", "Progesterone", "Prolactin",
        "FSH", "LH", "HBA1C", "Insulin Level", "C-Peptide",
        "Cholesterol (Total)", "HDL Cholesterol", "LDL Cholesterol", "Triglycerides",
        "Homocysteine", "Lipoprotein(a)", "Apolipoprotein A1", "Apolipoprotein B"
    );

    private static final List<String> RECORD_TYPES = List.of(
        "CONDITION", "VITAL", "ALLERGY", "PRESCRIPTION", "IMMUNIZATION",
        "SURGERY", "INJURY", "INFECTION", "CHRONIC_DISEASE", "FAMILY_HISTORY"
    );

    public List<String> getMedicineSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return MEDICINE_NAMES.stream().limit(20).collect(Collectors.toList());
        }
        
        String lowerQuery = query.toLowerCase().trim();
        return MEDICINE_NAMES.stream()
                .filter(medicine -> medicine.toLowerCase().contains(lowerQuery))
                .limit(20)
                .collect(Collectors.toList());
    }

    public List<String> getMedicalTestSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return MEDICAL_TESTS.stream().limit(20).collect(Collectors.toList());
        }
        
        String lowerQuery = query.toLowerCase().trim();
        return MEDICAL_TESTS.stream()
                .filter(test -> test.toLowerCase().contains(lowerQuery))
                .limit(20)
                .collect(Collectors.toList());
    }

    public List<String> getRecordTypeSuggestions() {
        return new ArrayList<>(RECORD_TYPES);
    }

    public List<String> getAllMedicineNames() {
        return new ArrayList<>(MEDICINE_NAMES);
    }

    public List<String> getAllMedicalTests() {
        return new ArrayList<>(MEDICAL_TESTS);
    }
}

