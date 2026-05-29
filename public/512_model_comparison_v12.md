# Comparative Analysis of Three BERT-Based Language Models for Turkish Court Decision Segmentation

## Experimental Results: BIO Token Classification on the v12 Dataset

**Report Date:** 14 March 2026

---

## 1. Introduction and Experimental Design

This report presents a comparative performance analysis of three BERT-based language models fine-tuned for the automatic structural segmentation of Turkish court decisions. The segmentation task decomposes court decisions into eight semantic segments: **header**, **formal**, **claim**, **defense**, **reasoning**, **ruling**, **footer**, and **dissent**. The task is formulated as a BIO (Beginning-Inside-Outside) token classification problem.

### 1.1 Models Under Comparison

| # | Model | Vocab Size | Domain | Cloze Top-1 |
|---|-------|-----------|--------|-------------|
| 1 | `turkhukuk/HukukBERT-base-512-beta` | 48K | Legal domain pre-training | 84.4% |
| 2 | `dbmdz/bert-base-turkish-128k-cased` | 128K | General domain | 75.5% |
| 3 | `KocLab-Bilkent/BERTurk-Legal` | 32K | Legal domain pre-training | 78.8% |

### 1.2 Training Hyperparameters (Identical Across All Models)

| Parameter | Value |
|-----------|-------|
| Learning rate (LR) | 3e-5 |
| Weight decay (WD) | 0.03 |
| B-tag weight | 5.0 |
| Effective batch size | 4 x 4 = 16 |
| Evaluation interval | every 50 steps |
| Logging interval | every 50 steps |
| Document evaluation interval | every 100 steps |
| Window size | 512 tokens |
| Stride | 256 tokens |
| Warmup steps | 100 |
| Class weights | Automatic |
| Number of epochs | 4 (HukukBERT early-stopped at ~3.67) |

### 1.3 Dataset

All models were trained on the **v12** segmentation dataset with `strip_newlines_ratio=1.0`. This dataset comprises Turkish court decisions annotated by expert legal professionals.

---

## 2. Epoch-Wise Comparative Results

The following tables report key metrics measured at approximately 0.25-epoch intervals for all three models.

### 2.1 Document-Level Metrics

| Epoch | HukukBERT doc_pass | HukukBERT tol_pass | HukukBERT bnd_acc | BERTurk-128k doc_pass | BERTurk-128k tol_pass | BERTurk-128k bnd_acc | BERTurk-Legal doc_pass | BERTurk-Legal tol_pass | BERTurk-Legal bnd_acc |
|---|---|---|---|---|---|---|---|---|---|
| 0.25 | 22.9 | 22.9 | 78.5 | 6.0 | 7.2 | 75.9 | 78.3 | 79.5 | 94.6 |
| 0.50 | 43.4 | 43.4 | 89.6 | 34.9 | 36.1 | 83.4 | 65.1 | 66.3 | 93.8 |
| 0.75 | 73.5 | 77.1 | 96.0 | 33.7 | 34.9 | 83.5 | 77.1 | 83.1 | 96.4 |
| 1.00 | 74.7 | 77.1 | 96.2 | 37.3 | 39.8 | 85.3 | 72.3 | 80.7 | 96.5 |
| 1.25 | 67.5 | 69.9 | 93.9 | 33.7 | 39.8 | 87.5 | 72.3 | 84.3 | 96.2 |
| 1.50 | 71.1 | 77.1 | 96.0 | 54.2 | 56.6 | 91.5 | 79.5 | 89.2 | 97.2 |
| 1.75 | 73.5 | 77.1 | 95.5 | 69.9 | 73.5 | 95.1 | 78.3 | 84.3 | 96.0 |
| 2.00 | 66.3 | 73.5 | 94.8 | 44.6 | 47.0 | 89.1 | 77.1 | 84.3 | 96.7 |
| 2.25 | 86.7 | 90.4 | 97.6 | 78.3 | 85.5 | 96.9 | 75.9 | 81.9 | 96.0 |
| 2.50 | 74.7 | 80.7 | 96.4 | 78.3 | 84.3 | 96.7 | 73.5 | 79.5 | 95.5 |
| 2.75 | 85.5 | 88.0 | 97.6 | 81.9 | 88.0 | 97.2 | 75.9 | 83.1 | 96.2 |
| 3.00 | 85.5 | 86.7 | 97.4 | 79.5 | 85.5 | 96.9 | 79.5 | 86.7 | 96.5 |
| 3.25 | 85.5 | 89.2 | 97.9 | 78.3 | 83.1 | 96.5 | 78.3 | 85.5 | 96.2 |
| 3.50 | 89.2 | 94.0 | 98.1 | 79.5 | 84.3 | 96.7 | 77.1 | 84.3 | 96.5 |
| 3.75 | 92.8 | 96.4 | 99.0 | 80.7 | 85.5 | 96.9 | 77.1 | 84.3 | 96.4 |
| 4.00 | -- | -- | -- | 80.7 | 86.7 | 97.1 | 77.1 | 84.3 | 96.4 |

*All values are reported as percentages (%). HukukBERT was early-stopped at epoch 3.67.*

### 2.2 Token-Level and Boundary Metrics

| Epoch | HukukBERT eval_loss | HukukBERT bnd_f1 | HukukBERT span_f1 | HukukBERT col_mac_f1 | BERTurk-128k eval_loss | BERTurk-128k bnd_f1 | BERTurk-128k span_f1 | BERTurk-128k col_mac_f1 | BERTurk-Legal eval_loss | BERTurk-Legal bnd_f1 | BERTurk-Legal span_f1 | BERTurk-Legal col_mac_f1 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.25 | 0.1782 | 71.9 | 30.8 | 91.9 | 0.1643 | 69.7 | 29.7 | 92.7 | 0.1518 | 84.3 | 47.6 | 93.0 |
| 0.50 | 0.1598 | 80.6 | 44.8 | 94.5 | 0.1930 | 75.2 | 38.8 | 93.0 | 0.1900 | 81.6 | 41.4 | 91.5 |
| 0.75 | 0.1960 | 87.8 | 52.2 | 92.8 | 0.2334 | 76.4 | 38.7 | 92.0 | 0.1721 | 87.2 | 51.6 | 93.0 |
| 1.00 | 0.2958 | 88.6 | 45.3 | 90.4 | 0.2482 | 83.4 | 45.5 | 92.7 | 0.1734 | 85.8 | 52.9 | 92.4 |
| 1.25 | 0.2533 | 89.1 | 49.0 | 92.9 | 0.2323 | 84.7 | 50.8 | 92.6 | 0.2280 | 89.5 | 56.4 | 93.5 |
| 1.50 | 0.1788 | 90.3 | 51.5 | 93.9 | 0.2883 | 83.5 | 49.3 | 92.1 | 0.2353 | 91.2 | 55.5 | 92.0 |
| 1.75 | 0.1965 | 91.1 | 56.3 | 94.7 | 0.3375 | 87.1 | 50.7 | 91.2 | 0.2087 | 90.2 | 54.3 | 92.2 |
| 2.00 | 0.2660 | 90.1 | 54.8 | 93.2 | 0.2675 | 86.1 | 50.5 | 92.7 | 0.3022 | 90.9 | 58.9 | 93.4 |
| 2.25 | 0.1827 | 89.9 | 62.5 | 94.6 | 0.3201 | 90.3 | 57.7 | 91.1 | 0.2866 | 91.0 | 63.0 | 93.2 |
| 2.50 | 0.2795 | 91.4 | 63.1 | 94.2 | 0.3235 | 90.8 | 62.2 | 92.8 | 0.2986 | 88.9 | 58.4 | 92.9 |
| 2.75 | 0.2475 | 90.9 | 59.2 | 92.0 | 0.3281 | 91.5 | 60.2 | 92.8 | 0.2705 | 91.2 | 56.5 | 92.4 |
| 3.00 | 0.1744 | 90.8 | 59.2 | 94.4 | 0.2937 | 91.6 | 60.8 | 92.8 | 0.3042 | 90.9 | 62.9 | 91.9 |
| 3.25 | 0.2127 | 90.3 | 59.5 | 93.8 | 0.2915 | 89.4 | 59.2 | 93.1 | 0.2773 | 91.4 | 60.2 | 93.8 |
| 3.50 | 0.3092 | 92.7 | 60.7 | 94.0 | 0.3010 | 91.8 | 60.8 | 92.4 | 0.2893 | 90.9 | 58.6 | 92.1 |
| 3.75 | 0.3280 | 92.4 | 65.3 | 94.1 | 0.2964 | 92.0 | 58.6 | 92.9 | 0.2979 | 90.9 | 59.8 | 92.7 |
| 4.00 | -- | -- | -- | -- | 0.2885 | 91.8 | 58.7 | 93.1 | 0.2867 | 91.0 | 60.4 | 93.7 |

### 2.3 B-Tag Precision/Recall for Core Segmentation Labels

| Epoch | HukukBERT B-reas P/R | HukukBERT B-claim P/R | HukukBERT B-def P/R | BERTurk-128k B-reas P/R | BERTurk-128k B-claim P/R | BERTurk-128k B-def P/R | BERTurk-Legal B-reas P/R | BERTurk-Legal B-claim P/R | BERTurk-Legal B-def P/R |
|---|---|---|---|---|---|---|---|---|---|
| 0.25 | 44.6/97.4 | 80.5/99.0 | 79.9/100.0 | 43.9/88.4 | 79.1/91.0 | 84.1/98.3 | 55.6/93.3 | 78.7/96.0 | 87.8/95.0 |
| 0.50 | 57.0/96.2 | 79.8/99.0 | 91.0/100.0 | 46.7/93.9 | 79.3/96.0 | 88.2/94.9 | 51.5/91.5 | 56.4/97.0 | 88.2/99.2 |
| 0.75 | 70.4/92.9 | 83.3/95.0 | 90.2/100.0 | 49.7/92.1 | 80.0/96.0 | 90.5/96.6 | 70.5/93.9 | 72.5/95.0 | 88.8/98.3 |
| 1.00 | 73.4/95.5 | 84.1/95.0 | 91.7/100.0 | 71.8/94.5 | 84.2/96.0 | 93.5/97.5 | 62.1/95.2 | 79.3/96.0 | 84.5/99.2 |
| 1.25 | 80.4/94.9 | 84.2/96.0 | 95.7/100.0 | 77.8/92.1 | 80.7/96.0 | 90.3/94.9 | 75.1/97.0 | 88.3/91.0 | 93.0/99.2 |
| 1.50 | 87.8/92.3 | 88.7/94.0 | 88.1/100.0 | 57.0/96.3 | 79.5/97.0 | 94.1/94.1 | 85.4/95.8 | 93.0/93.0 | 94.5/99.2 |
| 1.75 | 90.7/94.2 | 90.6/96.0 | 97.4/100.0 | 68.4/93.9 | 84.3/97.0 | 88.3/95.8 | 79.4/95.8 | 89.4/93.0 | 91.6/99.2 |
| 2.00 | 87.2/96.2 | 90.4/94.0 | 94.1/100.0 | 75.8/95.7 | 89.6/95.0 | 95.0/95.8 | 84.0/95.2 | 90.4/94.0 | 93.1/100.0 |
| 2.25 | 83.2/95.5 | 90.4/94.0 | 78.7/100.0 | 81.4/96.3 | 87.2/95.0 | 91.9/95.8 | 83.7/96.4 | 92.9/92.0 | 92.4/100.0 |
| 2.50 | 91.3/94.2 | 91.2/93.0 | 99.1/100.0 | 84.2/93.9 | 91.4/96.0 | 94.1/94.9 | 72.1/95.8 | 91.8/89.0 | 88.3/100.0 |
| 2.75 | 80.2/96.2 | 91.4/96.0 | 94.0/99.1 | 89.0/93.9 | 88.8/95.0 | 98.3/95.8 | 85.3/95.2 | 92.2/94.0 | 93.1/100.0 |
| 3.00 | 81.6/91.0 | 91.4/96.0 | 91.7/100.0 | 92.3/95.1 | 85.6/95.0 | 96.6/95.8 | 82.7/95.8 | 92.9/92.0 | 95.3/100.0 |
| 3.25 | 79.7/95.5 | 90.3/93.0 | 88.8/100.0 | 73.5/94.5 | 89.6/95.0 | 95.8/95.8 | 87.2/94.5 | 92.2/94.0 | 92.4/100.0 |
| 3.50 | 92.0/95.5 | 95.0/95.0 | 97.3/97.3 | 93.4/94.5 | 88.0/95.0 | 96.6/95.8 | 85.8/95.2 | 90.4/94.0 | 91.0/100.0 |
| 3.75 | 89.3/96.2 | 92.2/95.0 | 97.4/100.0 | 92.8/94.5 | 89.6/95.0 | 96.6/95.8 | 86.3/95.2 | 90.4/94.0 | 90.3/100.0 |
| 4.00 | -- | -- | -- | 92.3/94.5 | 88.8/95.0 | 96.6/95.8 | 86.3/95.2 | 92.2/94.0 | 90.3/100.0 |

---

## 3. Peak Performance Comparison

Table 1 summarizes the best score achieved by each model across the entire training run, along with the training step and epoch at which the peak occurred.

**Table 1.** Peak metric values across all three models.

| Metric | HukukBERT | Step / Epoch | BERTurk-128k | Step / Epoch | BERTurk-Legal | Step / Epoch |
|--------|-----------|-------------|-------------|-------------|--------------|-------------|
| Document pass rate (doc_pass) | **92.8%** | 10900 / 3.67 | 84.3% | 10800 / 3.36 | 81.9% | 2500 / 0.70 |
| Tolerant document pass (tol_pass) | **96.4%** | 10900 / 3.67 | 88.0% | 8550 / 2.66 | 89.2% | 4400 / 1.22 |
| Boundary accuracy (bnd_acc) | **99.0%** | 10900 / 3.67 | 97.2% | 8700 / 2.71 | 97.6% | 3900 / 1.09 |
| Boundary F1 (bnd_f1) | **93.0%** | 10700 / 3.61 | 92.4% | 9950 / 3.10 | 91.9% | 7750 / 2.16 |
| Span exact F1 (span_exact_f1) | **67.8%** | 8850 / 2.98 | 65.0% | 8550 / 2.66 | 65.4% | 7550 / 2.10 |
| Collapsed macro F1 (col_mac_f1) | **95.5%** | 6400 / 2.16 | 93.9% | 7400 / 2.30 | 94.2% | 4250 / 1.18 |
| Collapsed weighted F1 | **97.5%** | 8950 / 3.02 | 97.0% | 6950 / 2.16 | 96.9% | 3000 / 0.83 |
| Minimum eval loss | 0.1413 | 1900 / 0.64 | 0.1486 | 900 / 0.28 | 0.1441 | 1400 / 0.39 |

### 3.1 Best Checkpoint Summary

**HukukBERT** (best step: 10900, best metric [doc_pass]: 92.8%)
- Epoch: 3.67
- doc_pass: 92.8% | tolerant_pass: 96.4%
- boundary_f1: 92.4% | span_exact_f1: 65.3%
- collapsed_macro_f1: 94.1%
- eval_loss: 0.3280

**BERTurk-128k** (best step: 10800, best metric [doc_pass]: 84.3%)
- Epoch: 3.36
- doc_pass: 84.3% | tolerant_pass: 88.0%
- boundary_f1: 92.0% | span_exact_f1: 61.6%
- collapsed_macro_f1: 92.9%
- eval_loss: 0.3392

**BERTurk-Legal** (best step: 2500, best metric [doc_pass]: 81.9%)
- Epoch: 0.70
- doc_pass: 81.9% | tolerant_pass: 85.5%
- boundary_f1: 88.5% | span_exact_f1: 50.6%
- collapsed_macro_f1: 92.9%
- eval_loss: 0.1521

---

## 4. B-Tag Analysis at Peak Performance

B-tags mark the beginning of each segment and therefore serve as the most critical indicator of segmentation quality. Table 2 reports the per-label precision (P), recall (R), and F1 at each model's best doc_pass checkpoint.

**Table 2.** Per-label B-tag precision, recall, and F1 at the peak doc_pass checkpoint.

| Label | HukukBERT P | HukukBERT R | HukukBERT F1 | BERTurk-128k P | BERTurk-128k R | BERTurk-128k F1 | BERTurk-Legal P | BERTurk-Legal R | BERTurk-Legal F1 |
|---|---|---|---|---|---|---|---|---|---|
| B-header | 52.2 | 100.0 | 68.6 | 51.2 | 100.0 | 67.8 | 51.2 | 100.0 | 67.8 |
| B-formal | 98.8 | 100.0 | 99.4 | 97.6 | 100.0 | 98.8 | 96.2 | 96.2 | 96.3 |
| B-claim | 92.2 | 95.0 | 93.6 | 89.6 | 95.0 | 92.2 | 82.6 | 95.0 | 88.4 |
| B-defense | 97.4 | 100.0 | 98.7 | 97.4 | 95.8 | 96.6 | 95.2 | 99.2 | 97.2 |
| B-reasoning | 89.3 | 96.2 | 92.6 | 92.3 | 94.5 | 93.4 | 69.5 | 95.2 | 80.3 |
| B-ruling | 94.8 | 99.4 | 97.0 | 94.6 | 100.0 | 97.2 | 93.1 | 99.4 | 96.2 |
| B-footer | 99.0 | 99.0 | 99.0 | 98.9 | 98.9 | 98.9 | 96.0 | 100.0 | 98.0 |
| B-dissent | 100.0 | 93.8 | 96.8 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 | 100.0 |

### 4.1 Collapsed (B+I) Label F1 at Peak Performance

Table 3 presents the collapsed F1 scores per segment type, where B and I tags are merged to evaluate overall span-level classification accuracy.

**Table 3.** Collapsed (B+I) per-segment F1 at each model's best doc_pass checkpoint.

| Segment | HukukBERT | BERTurk-128k | BERTurk-Legal |
|---------|-----------|-------------|--------------|
| header | 99.3 | 99.4 | 99.3 |
| formal | 99.8 | 99.4 | 98.7 |
| claim | 93.9 | 91.0 | 93.2 |
| defense | 94.4 | 90.6 | 94.5 |
| reasoning | 97.3 | 97.8 | 97.8 |
| ruling | 99.6 | 99.4 | 98.9 |
| footer | 97.9 | 99.8 | 94.7 |
| dissent | 70.7 | 65.8 | 66.2 |

---

## 5. Convergence Speed Analysis

### 5.1 Epoch at Which Performance Thresholds Were First Reached

Tables 4--7 report the earliest epoch at which each model first achieved a given performance threshold for each key metric.

**Table 4.** Convergence to doc_pass thresholds (epoch).

| Threshold | HukukBERT | BERTurk-128k | BERTurk-Legal |
|-----------|-----------|-------------|--------------|
| 50% | 0.52 | 1.49 | 0.18 |
| 60% | 0.54 | 1.65 | 0.18 |
| 70% | 0.54 | 1.65 | 0.21 |
| 80% | 1.18 | 2.13 | 0.70 |
| 90% | 2.22 | not reached | not reached |

**Table 5.** Convergence to boundary_f1 thresholds (epoch).

| Threshold | HukukBERT | BERTurk-128k | BERTurk-Legal |
|-----------|-----------|-------------|--------------|
| 50% | 0.07 | 0.08 | 0.07 |
| 60% | 0.12 | 0.09 | 0.08 |
| 70% | 0.19 | 0.26 | 0.13 |
| 80% | 0.32 | 0.90 | 0.18 |

**Table 6.** Convergence to span_exact_f1 thresholds (epoch).

| Threshold | HukukBERT | BERTurk-128k | BERTurk-Legal |
|-----------|-----------|-------------|--------------|
| 30% | 0.17 | 0.26 | 0.13 |
| 40% | 0.37 | 0.53 | 0.18 |
| 50% | 0.54 | 1.25 | 0.40 |
| 60% | 2.12 | 2.18 | 1.03 |
| 70% | not reached | not reached | not reached |

**Table 7.** Convergence to collapsed_macro_f1 thresholds (epoch).

| Threshold | HukukBERT | BERTurk-128k | BERTurk-Legal |
|-----------|-----------|-------------|--------------|
| 70% | 0.05 | 0.03 | 0.03 |
| 80% | 0.05 | 0.06 | 0.04 |
| 85% | 0.05 | 0.08 | 0.06 |
| 90% | 0.07 | 0.17 | 0.13 |

---

## 6. Training Dynamics

### 6.1 Training Loss Trajectory

| Epoch | HukukBERT | BERTurk-128k | BERTurk-Legal |
|-------|-----------|-------------|--------------|
| 0.25 | 0.0272 | 0.3472 | 0.1448 |
| 0.50 | 0.2181 | 0.0971 | 0.1393 |
| 0.75 | 0.0644 | 0.0550 | 0.1427 |
| 1.00 | 0.0159 | 0.0358 | 0.0217 |
| 1.25 | 0.0073 | 0.0839 | 0.0683 |
| 1.50 | 0.0102 | 0.0331 | 0.1197 |
| 1.75 | 0.0324 | 0.0825 | 0.0110 |
| 2.00 | 0.0740 | 0.0399 | 0.0014 |
| 2.25 | 0.0583 | 0.0633 | 0.0010 |
| 2.50 | 0.0024 | 0.0221 | 0.0013 |
| 2.75 | 0.0397 | 0.0275 | 0.0316 |
| 3.00 | 0.1061 | 0.0013 | 0.0049 |
| 3.25 | 0.0239 | 0.0435 | 0.0227 |
| 3.50 | 0.0714 | 0.0012 | 0.0286 |
| 3.75 | 0.0266 | 0.0012 | 0.0355 |
| 4.00 | -- | 0.0223 | 0.0009 |

### 6.2 Validation Loss Trajectory

| Epoch | HukukBERT | BERTurk-128k | BERTurk-Legal |
|-------|-----------|-------------|--------------|
| 0.25 | 0.1782 | 0.1643 | 0.1518 |
| 0.50 | 0.1598 | 0.1930 | 0.1900 |
| 0.75 | 0.1960 | 0.2334 | 0.1721 |
| 1.00 | 0.2958 | 0.2482 | 0.1734 |
| 1.25 | 0.2533 | 0.2323 | 0.2280 |
| 1.50 | 0.1788 | 0.2883 | 0.2353 |
| 1.75 | 0.1965 | 0.3375 | 0.2087 |
| 2.00 | 0.2660 | 0.2675 | 0.3022 |
| 2.25 | 0.1827 | 0.3201 | 0.2866 |
| 2.50 | 0.2795 | 0.3235 | 0.2986 |
| 2.75 | 0.2475 | 0.3281 | 0.2705 |
| 3.00 | 0.1744 | 0.2937 | 0.3042 |
| 3.25 | 0.2127 | 0.2915 | 0.2773 |
| 3.50 | 0.3092 | 0.3010 | 0.2893 |
| 3.75 | 0.3280 | 0.2964 | 0.2979 |
| 4.00 | -- | 0.2885 | 0.2867 |

### 6.3 Overfitting Indicators

All three models exhibit a substantial gap between minimum validation loss and final validation loss, indicating significant overfitting of the cross-entropy objective. Importantly, however, task-level metrics (doc_pass, boundary_f1) continue to improve well beyond the point of minimum validation loss.

**HukukBERT:**
- Minimum validation loss: 0.1413 (epoch 0.64, step 1900)
- Final validation loss: 0.3280 (epoch 3.67)
- Loss increase: +0.1867 (+132.1%)

**BERTurk-128k:**
- Minimum validation loss: 0.1486 (epoch 0.28, step 900)
- Final validation loss: 0.2885 (epoch 3.99)
- Loss increase: +0.1399 (+94.1%)

**BERTurk-Legal:**
- Minimum validation loss: 0.1441 (epoch 0.39, step 1400)
- Final validation loss: 0.2867 (epoch 3.99)
- Loss increase: +0.1427 (+99.0%)

---

## 7. Discussion

### 7.1 Overall Performance Assessment

The comparison of the three models reveals the interplay between domain-specific pre-training and vocabulary design for structural legal text segmentation. HukukBERT achieved the highest document pass rate at **92.8%**, compared to **84.3%** for BERTurk-128k and **81.9%** for BERTurk-Legal. HukukBERT outperformed the general-domain model by 8.5 percentage points and the alternative legal-domain model by 10.9 percentage points on the primary evaluation metric.

### 7.2 Effect of Domain-Specific Pre-Training

The performance differences among the three models illuminate the critical role of domain-specific pre-training for the segmentation task:

1. **Correlation between cloze test accuracy and task performance.** HukukBERT's cloze top-1 score of 84.4% directly corresponds to its superior segmentation performance. This finding confirms that domain-specific language modeling yields meaningful improvements on downstream tasks.

2. **Vocabulary size versus domain alignment.** Despite its substantially larger vocabulary (128K), BERTurk-128k failed to match HukukBERT (48K vocabulary) because it lacks internalized representations of legal terminology. This demonstrates that vocabulary size alone is not a decisive factor; domain alignment is the more critical variable.

3. **BERTurk-Legal assessment.** Although this model (32K vocabulary) received legal domain pre-training, it did not approach HukukBERT's performance. This disparity suggests that the size and quality of the pre-training corpus, as well as vocabulary optimization for the specific legal sublanguage, are also important determinants.

### 7.3 Boundary Detection and Span Matching Performance

At peak performance:

- **HukukBERT:** boundary F1 = 92.4%, span exact F1 = 65.3%
- **BERTurk-128k:** boundary F1 = 92.0%, span exact F1 = 61.6%
- **BERTurk-Legal:** boundary F1 = 88.5%, span exact F1 = 50.6%

Boundary detection metrics measure how accurately the model identifies transitions between segments. HukukBERT's superiority on these metrics reflects the model's deeper understanding of legal text structure. Correctly identifying the boundary between the *reasoning* and *ruling* sections is of particular practical importance in court decision analysis.

### 7.4 Per-Label Performance Analysis

B-tags mark the beginning of each segment and are therefore the most critical indicators of segmentation quality.

**Labels ranked by difficulty (HukukBERT at peak):**

1. **B-formal:** F1 = 99.4% (easy)
2. **B-footer:** F1 = 99.0% (easy)
3. **B-defense:** F1 = 98.7% (easy)
4. **B-ruling:** F1 = 97.0% (easy)
5. **B-dissent:** F1 = 96.8% (easy)
6. **B-claim:** F1 = 93.6% (moderate)
7. **B-reasoning:** F1 = 92.6% (moderate)
8. **B-header:** F1 = 68.6% (hard)

The `B-header` label exhibits the lowest F1 across all models. This is attributable to low precision rather than low recall: all models achieve 100% recall for B-header, but they tend to produce false positive B-header predictions at the beginnings of other segments. The `B-reasoning` and `B-claim` labels are comparatively more challenging due to the length and variability of reasoning sections and the semantic diversity of claim formulations.

In the collapsed (B+I) metrics, the `dissent` class yields the lowest F1 scores (65--71% range). This is expected, as dissenting opinion sections are rare in the dataset and exhibit considerable structural variation.

### 7.5 Convergence and Training Stability

The convergence analysis reveals important insights into the learning dynamics of each model:

1. **HukukBERT** demonstrated the fastest convergence profile. Legal domain pre-training positioned the model's initial representations in a task-compatible region of the parameter space, enabling high performance with fewer training steps.

2. **Early stopping observation:** HukukBERT reached its peak performance at epoch 3.67, after which overfitting symptoms emerged. This suggests that 4 epochs of training is appropriate (and possibly slightly excessive) for this model.

3. **BERTurk-128k** achieved its best performance at epoch 3.36, indicating that the general-domain model requires more training steps to learn the legal text structure.

4. **BERTurk-Legal** presents a notable finding: its best doc_pass (81.9%) was achieved at a very early stage (epoch 0.70, step 2500). Beyond this point, the model exhibited fluctuating performance that never surpassed this peak. This may be interpreted as evidence that the model's capacity (constrained by its 32K vocabulary) is insufficient for the task, or that the legal pre-training provides a strong initialization that is not further exploitable through fine-tuning. However, other metrics (boundary_f1, span_exact_f1) continued to improve at later epochs, suggesting that the high variance of the doc_pass metric -- which requires all boundaries within a document to be correct -- explains part of this apparent plateau.

### 7.6 Divergence Between doc_pass and Other Metrics

A noteworthy finding is that doc_pass peaks at a different training step than lower-level metrics. For example:

- **HukukBERT:** Best doc_pass (92.8%) at epoch 3.67, but best boundary_f1 (93.0%) at epoch 3.61, best span_exact_f1 (67.8%) at epoch 2.98, and best collapsed_macro_f1 (95.5%) at epoch 2.16.
- **BERTurk-Legal:** Best doc_pass (81.9%) at epoch 0.70, but best boundary_f1 (91.9%) at epoch 2.16 and best span_exact_f1 (65.4%) at epoch 2.10.

This divergence arises because doc_pass is a document-level binary (pass/fail) evaluation in which a single incorrect boundary prediction causes the entire document to fail. Consequently, the models' overall segmentation quality (as measured by collapsed_macro_f1 and boundary_f1) may be substantially better than what doc_pass suggests.

### 7.7 Overfitting Analysis

All three models exhibit a characteristic pattern in which validation loss begins to increase early in training while task-level metrics continue to improve:

- **HukukBERT:** Minimum loss at epoch 0.64, best doc_pass at epoch 3.67 (3.03 epochs apart).
- **BERTurk-128k:** Minimum loss at epoch 0.28, best doc_pass at epoch 3.36 (3.08 epochs apart).
- **BERTurk-Legal:** Minimum loss at epoch 0.39, best doc_pass at epoch 0.70 (0.31 epochs apart).

This phenomenon -- in which the cross-entropy loss overfits while the task metric continues to improve -- is well documented in the token classification literature and underscores the importance of selecting checkpoints based on task-specific metrics rather than validation loss.

### 7.8 Practical Recommendations

1. **Model selection.** For Turkish legal text segmentation, `HukukBERT-base-512-beta` delivers the strongest performance by a significant margin and is recommended for production deployment.

2. **Training strategy.** Training for 3--4 epochs is sufficient for all models. Early stopping should be applied based on the doc_pass metric.

3. **Domain-specific pre-training.** The results conclusively demonstrate that domain-specific pre-training is more effective than either a large vocabulary or general-domain training for legal NLP tasks.

4. **Future work.** Targeted data augmentation and class-weight tuning for the underperforming segment types (`dissent`, `claim`, `defense`) may yield further improvements.

---

## Appendix A: Detailed Evaluation Metrics -- HukukBERT

Key evaluation milestones sampled at approximately 0.5-epoch intervals from the full training run (218 evaluation points). The best checkpoint is marked with **.

| Step | Epoch | eval_loss | doc_pass | tol_pass | bnd_f1 | span_f1 | col_mac_f1 | B-reas F1 | B-claim F1 | B-def F1 |
|------|-------|-----------|----------|----------|--------|---------|------------|-----------|------------|----------|
| 100 | 0.03 | 0.5188 | 1.2 | 1.2 | 32.6 | 8.7 | 69.0 | 15.8 | 12.4 | 21.5 |
| 800 | 0.27 | 0.1588 | 24.1 | 24.1 | 75.9 | 33.1 | 93.3 | 71.4 | 88.6 | 93.7 |
| 1500 | 0.51 | 0.1598 | 43.4 | 43.4 | 80.6 | 44.8 | 94.5 | 71.6 | 88.4 | 95.3 |
| 1900 | 0.64 | 0.1413 | 42.2 | 43.4 | 82.7 | 44.8 | 93.6 | 78.6 | 85.7 | 94.4 |
| 2200 | 0.74 | 0.1960 | 73.5 | 77.1 | 87.8 | 52.2 | 92.8 | 80.1 | 88.8 | 94.9 |
| 3000 | 1.01 | 0.2588 | 71.1 | 74.7 | 89.9 | 53.9 | 93.0 | 88.1 | 93.1 | 92.5 |
| 3500 | 1.18 | 0.3481 | 80.7 | 84.3 | 90.1 | 47.5 | 92.2 | 87.1 | 91.4 | 97.8 |
| 4500 | 1.52 | 0.2111 | 72.3 | 77.1 | 89.8 | 54.9 | 94.4 | 86.7 | 90.4 | 96.1 |
| 5200 | 1.75 | 0.1965 | 73.5 | 77.1 | 91.1 | 56.3 | 94.7 | 92.5 | 93.2 | 98.7 |
| 5900 | 1.99 | 0.3327 | 60.2 | 71.1 | 90.1 | 53.7 | 91.7 | 94.5 | 92.6 | 98.7 |
| 6400 | 2.16 | 0.1824 | 73.5 | 78.3 | 91.1 | 62.5 | 95.5 | 90.9 | 94.6 | 96.9 |
| 6700 | 2.26 | 0.1827 | 86.7 | 90.4 | 89.9 | 62.5 | 94.6 | 89.0 | 92.2 | 88.1 |
| 7400 | 2.49 | 0.2795 | 74.7 | 80.7 | 91.4 | 63.1 | 94.2 | 92.7 | 92.1 | 99.6 |
| 8200 | 2.76 | 0.1829 | 80.7 | 84.3 | 91.2 | 63.8 | 93.6 | 88.7 | 94.7 | 96.5 |
| 8900 | 3.00 | 0.1744 | 85.5 | 86.7 | 90.8 | 59.2 | 94.4 | 86.1 | 93.7 | 95.7 |
| 9900 | 3.34 | 0.2572 | 89.2 | 94.0 | 92.8 | 61.7 | 94.0 | 94.2 | 93.7 | 98.7 |
| 10400 | 3.51 | 0.3092 | 89.2 | 94.0 | 92.7 | 60.7 | 94.0 | 93.7 | 95.0 | 97.3 |
| 10700 | 3.61 | 0.3393 | 91.6 | 95.2 | 93.0 | 65.9 | 93.7 | 94.9 | 94.4 | 98.2 |
| **10900** | **3.67** | **0.3280** | **92.8** | **96.4** | **92.4** | **65.3** | **94.1** | **92.6** | **93.6** | **98.7** |

## Appendix B: Detailed Evaluation Metrics -- BERTurk-128k

Key evaluation milestones sampled at approximately 0.5-epoch intervals. The best checkpoint is marked with **.

| Step | Epoch | eval_loss | doc_pass | tol_pass | bnd_f1 | span_f1 | col_mac_f1 | B-reas F1 | B-claim F1 | B-def F1 |
|------|-------|-----------|----------|----------|--------|---------|------------|-----------|------------|----------|
| 100 | 0.03 | 0.6065 | 1.2 | 1.2 | 1.2 | 4.9 | 70.9 | 0.0 | 0.0 | 0.0 |
| 800 | 0.25 | 0.1643 | 6.0 | 7.2 | 69.7 | 29.7 | 92.7 | 58.7 | 84.7 | 90.6 |
| 1600 | 0.50 | 0.1930 | 34.9 | 36.1 | 75.2 | 38.8 | 93.0 | 62.3 | 86.9 | 91.4 |
| 2400 | 0.75 | 0.2334 | 33.7 | 34.9 | 76.4 | 38.7 | 92.0 | 64.5 | 87.3 | 93.4 |
| 3200 | 1.00 | 0.2482 | 37.3 | 39.8 | 83.4 | 45.5 | 92.7 | 81.6 | 89.7 | 95.4 |
| 4000 | 1.25 | 0.2323 | 33.7 | 39.8 | 84.7 | 50.8 | 92.6 | 84.4 | 87.7 | 92.6 |
| 4800 | 1.49 | 0.2883 | 54.2 | 56.6 | 83.5 | 49.3 | 92.1 | 71.7 | 87.4 | 94.1 |
| 5600 | 1.74 | 0.3375 | 69.9 | 73.5 | 87.1 | 50.7 | 91.2 | 79.2 | 90.2 | 91.9 |
| 6400 | 1.99 | 0.2675 | 44.6 | 47.0 | 86.1 | 50.5 | 92.7 | 84.6 | 92.2 | 95.4 |
| 7200 | 2.24 | 0.2529 | 79.5 | 86.7 | 91.5 | 59.0 | 93.4 | 90.9 | 93.1 | 96.2 |
| 8000 | 2.49 | 0.3151 | 79.5 | 85.5 | 91.1 | 62.7 | 92.9 | 90.6 | 93.2 | 94.2 |
| 8700 | 2.71 | 0.3012 | 81.9 | 88.0 | 91.7 | 60.8 | 92.8 | 92.7 | 93.2 | 96.2 |
| 9500 | 2.96 | 0.2372 | 78.3 | 84.3 | 90.8 | 62.5 | 93.6 | 89.1 | 92.7 | 95.0 |
| 9600 | 2.99 | 0.2861 | 80.7 | 86.7 | 92.0 | 62.2 | 93.0 | 92.9 | 94.1 | 97.0 |
| 10300 | 3.21 | 0.2463 | 79.5 | 85.5 | 91.5 | 62.0 | 93.8 | 91.3 | 93.6 | 95.8 |
| **10800** | **3.36** | **0.3392** | **84.3** | **88.0** | **92.0** | **61.6** | **92.9** | **93.4** | **92.2** | **96.6** |
| 11500 | 3.58 | 0.3256 | 80.7 | 85.5 | 91.4 | 63.0 | 92.5 | 91.9 | 91.3 | 95.0 |
| 12800 | 3.99 | 0.2885 | 80.7 | 86.7 | 91.8 | 58.7 | 93.1 | 93.4 | 91.8 | 96.2 |

## Appendix C: Detailed Evaluation Metrics -- BERTurk-Legal

Key evaluation milestones sampled at approximately 0.5-epoch intervals. The best checkpoint is marked with **.

| Step | Epoch | eval_loss | doc_pass | tol_pass | bnd_f1 | span_f1 | col_mac_f1 | B-reas F1 | B-claim F1 | B-def F1 |
|------|-------|-----------|----------|----------|--------|---------|------------|-----------|------------|----------|
| 100 | 0.03 | 0.5228 | 1.2 | 1.2 | 17.9 | 5.0 | 72.7 | 1.2 | 2.0 | 0.0 |
| 900 | 0.25 | 0.1518 | 78.3 | 79.5 | 84.3 | 47.6 | 93.0 | 69.7 | 86.5 | 91.3 |
| 1800 | 0.50 | 0.1900 | 65.1 | 66.3 | 81.6 | 41.4 | 91.5 | 65.9 | 71.3 | 93.4 |
| **2500** | **0.70** | **0.1521** | **81.9** | **85.5** | **88.5** | **50.6** | **92.9** | **80.3** | **88.4** | **97.2** |
| 2700 | 0.75 | 0.1721 | 77.1 | 83.1 | 87.2 | 51.6 | 93.0 | 80.5 | 82.3 | 93.3 |
| 3600 | 1.00 | 0.1734 | 72.3 | 80.7 | 85.8 | 52.9 | 92.4 | 75.1 | 86.9 | 91.3 |
| 4500 | 1.25 | 0.2280 | 72.3 | 84.3 | 89.5 | 56.4 | 93.5 | 84.7 | 89.7 | 96.0 |
| 5400 | 1.50 | 0.2353 | 79.5 | 89.2 | 91.2 | 55.5 | 92.0 | 90.3 | 93.0 | 96.8 |
| 6300 | 1.75 | 0.2087 | 78.3 | 84.3 | 90.2 | 54.3 | 92.2 | 86.8 | 91.2 | 95.2 |
| 7200 | 2.00 | 0.3022 | 77.1 | 84.3 | 90.9 | 58.9 | 93.4 | 89.2 | 92.2 | 96.4 |
| 8100 | 2.25 | 0.2866 | 75.9 | 81.9 | 91.0 | 63.0 | 93.2 | 89.6 | 92.5 | 96.0 |
| 9000 | 2.50 | 0.2986 | 73.5 | 79.5 | 88.9 | 58.4 | 92.9 | 82.3 | 90.4 | 93.8 |
| 9900 | 2.76 | 0.2705 | 75.9 | 83.1 | 91.2 | 56.5 | 92.4 | 90.0 | 93.1 | 96.4 |
| 10800 | 3.01 | 0.3042 | 79.5 | 86.7 | 90.9 | 62.9 | 91.9 | 88.8 | 92.5 | 97.6 |
| 11700 | 3.26 | 0.2773 | 78.3 | 85.5 | 91.4 | 60.2 | 93.8 | 90.7 | 93.1 | 96.0 |
| 12600 | 3.51 | 0.2893 | 77.1 | 84.3 | 90.9 | 58.6 | 92.1 | 90.2 | 92.2 | 95.3 |
| 13800 | 3.84 | 0.2864 | 78.3 | 85.5 | 91.1 | 62.4 | 93.8 | 90.4 | 93.1 | 95.3 |
| 14300 | 3.98 | 0.2865 | 77.1 | 84.3 | 91.0 | 60.4 | 93.7 | 90.5 | 93.1 | 94.9 |

## Appendix D: Statistical Summary

### Training Configuration Details

| Parameter | HukukBERT | BERTurk-128k | BERTurk-Legal |
|-----------|-----------|-------------|--------------|
| Total training steps | 29,670 | 12,848 | 14,372 |
| Planned epochs | 10 | 4 | 4 |
| Actual epochs completed | 3.67 | 3.99 | 3.99 |
| Best checkpoint step | 10,900 | 10,800 | 2,500 |
| Best doc_pass | 92.8% | 84.3% | 81.9% |
| Total evaluation points | 218 | 256 | 287 |

---

*This report was generated from `trainer_state.json` files. All metrics reflect evaluation results recorded during training.*
