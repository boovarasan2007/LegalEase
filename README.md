# LegalEase — AI-Powered Legal Document Understanding Platform

LegalEase is an AI-powered legal document understanding and assistance platform designed to help everyday users, small business owners, tenants, and developers understand legal documents in simple language.

---

## ⚖️ Important Legal Disclaimer

> **LegalEase provides general informational assistance and is not a substitute for advice from a qualified lawyer.** AI-generated information may contain errors. Always consult a qualified legal professional for advice about your specific situation. LegalEase does not provide legal advice or form an attorney-client relationship.

---

## 🚀 Live Web Application (Full-Stack Express + React + Gemini)

The application running in AI Studio is a full-stack, responsive web application powered by **Google Gemini 3.8 Flash** (`@google/genai`), Express, and React 19:

- **Document Ingestion**: Upload PDF, DOCX, or TXT documents (or test immediately with 1-click sample contracts like Mutual NDA, Commercial Lease, or SaaS Agreement).
- **Executive Summaries**: Converts complex legalese into clear digests and section breakdowns.
- **Key Information Matrix**: Automatically extracts parties, dates, monetary fees, deadlines, obligations, rights, termination rules, and penalties.
- **Explain in Simple Language**: Clause-by-clause translation with "Why It Matters" and "Questions for an Attorney".
- **Interactive Clause Translator**: Paste or highlight any custom legal clause to translate it in real-time!
- **Points to Review**: Neutral risk guidance on liability limitations, indemnity, automatic renewals, and broad obligations.
- **Ask LegalEase Q&A**: Interactive chat grounded strictly in the document text, with section and paragraph citations.
- **Legal Terminology Dictionary**: Searchable educational glossary of 30+ core legal terms.
- **Report Export**: Download complete text summary reports for offline reference.

### Dev Server Commands:
```bash
# Start full-stack dev server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

---

## 🐍 Standalone Python Flask Implementation

A standalone Python Flask implementation is also included in the `/LegalEase` directory with SQLite3, `pypdf`, `python-docx`, and `pytest`.

To run the Python version:
```bash
cd LegalEase
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```
Open `http://127.0.0.1:5000` in your browser.
