# LegalEase — AI-Powered Legal Document Understanding

LegalEase is an AI-powered legal document understanding and assistance platform designed to help users understand legal documents in simple language.

---

## ⚖️ Important Legal Disclaimer

> **LegalEase provides general informational assistance and is not a substitute for advice from a qualified lawyer.** AI-generated information may contain errors. Always consult a qualified legal professional for advice about your specific situation. LegalEase does not provide legal advice or form an attorney-client relationship.

---

## 🌟 Key Features

1. **Multi-Format Document Parsing**:
   - PDF (page-by-page extraction via `pypdf`)
   - DOCX (paragraphs & tables via `python-docx`)
   - TXT (UTF-8 with Latin-1 fallback)
   - Built-in scanned image & empty document detection

2. **Plain Language Summaries**:
   - Executive short summaries
   - Structural section breakdowns
   - Explicit document purpose detection

3. **Key Information Extraction**:
   - Parties involved
   - Important dates (Effective date, Term expiration)
   - Monetary amounts, fees, and penalties
   - Deadlines and notice periods
   - Core obligations and rights
   - Governing law and dispute resolution venues

4. **"Explain in Simple Language" Clause Breakdown**:
   - Original clause quote
   - Everyday translation
   - Why it matters practically
   - Specific questions to ask an attorney

5. **Important Points to Review (Risks & Attention)**:
   - Neutral guidance (e.g. "This clause may deserve closer review...")
   - Categorized by: Indemnity, Liability Caps, Automatic Renewals, Payment terms, Penalties

6. **Interactive Grounded Q&A ("Ask LegalEase")**:
   - Answers grounded strictly in uploaded document text
   - Cites section/clause/page numbers
   - Never fabricates facts: explicitly states *"I couldn't find a clear answer to that question in the uploaded document"* if not present

7. **Legal Terminology Dictionary**:
   - Plain-English definitions, examples, and practical tips for common terms (Indemnity, Force Majeure, Consideration, Jurisdiction, etc.)

---

## 💻 Technology Stack

- **Backend**: Python 3.10+, Flask
- **Database**: SQLite3
- **Document Extractors**: `pypdf`, `python-docx`
- **AI Engine**: Google Gemini API (`@google/genai`, `gemini-3.8-flash`) or OpenAI API (`gpt-4o-mini`)
- **Testing**: `pytest`

---

## 🚀 Installation & Setup

### 1. Clone & Navigate to Repository

```bash
git clone <repository_url>
cd LegalEase
```

### 2. Create and Activate Virtual Environment

**Linux / macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the `LegalEase` directory:

```env
# Choose Gemini or OpenAI
GEMINI_API_KEY=your_gemini_api_key_here
# or:
OPENAI_API_KEY=your_openai_api_key_here

SECRET_KEY=your_secret_session_key_here
PORT=5000
```

### 5. Run the Application

```bash
python app.py
```

Then open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 🧪 Running Tests

Automated tests cover PDF/DOCX/TXT extraction, empty document handling, database CRUD operations, and fallback modes:

```bash
pytest tests/ -v
```

---

## 🛠️ Common Errors & Troubleshooting

| Error | Cause | Solution |
|---|---|---|
| `Unsupported file format` | Uploaded file is not `.pdf`, `.docx`, or `.txt` | Upload a supported document file format. |
| `LegalEase could not extract readable text...` | Scanned PDF with image-only text | Provide a text-based PDF or export to TXT. |
| `API Key missing / not configured` | Missing `GEMINI_API_KEY` or `OPENAI_API_KEY` | Set your key in `.env`. The app will use the heuristic fallback if absent. |
| `Database locked` (SQLite) | Multiple concurrent writes in SQLite | Restart the Flask dev server or check open file handles. |
