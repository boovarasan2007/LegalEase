import os
import json
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, Response
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

from services.database import (
    init_db,
    save_document,
    get_document,
    get_all_documents,
    delete_document,
    save_analysis,
    get_analysis,
    save_conversation,
    get_conversations,
)
from services.document_parser import extract_document_text
from services.ai_service import LegalEaseAIService
from services.summarizer import format_analysis_summary

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "legalease_default_secret_key_12345")

# File Upload Configuration
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 15 * 1024 * 1024  # 15 MB limit
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

ai_service = LegalEaseAIService()

# Ensure database is initialized
init_db()

def allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Global template context
@app.context_processor
def inject_globals():
    return {
        "disclaimer_text": (
            "LegalEase provides general informational assistance and is not a substitute for advice from a "
            "qualified lawyer. AI-generated information may contain errors. Always consult a qualified legal "
            "professional for advice about your specific situation."
        )
    }

@app.route('/')
def index():
    """Landing Home Page with hero, features, and recent documents."""
    recent_docs = get_all_documents()
    return render_template('index.html', documents=recent_docs)

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    """Upload page for PDF, DOCX, and TXT documents."""
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part in request.', 'error')
            return redirect(request.url)

        file = request.files['file']
        if file.filename == '':
            flash('No document selected. Please choose a PDF, DOCX, or TXT file.', 'error')
            return redirect(request.url)

        if not allowed_file(file.filename):
            flash('Invalid file type. Supported formats are PDF, DOCX, and TXT.', 'error')
            return redirect(request.url)

        filename = secure_filename(file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(save_path)

        try:
            # Extract document text
            extracted = extract_document_text(save_path, filename)
            doc_id = save_document(
                filename=filename,
                filepath=save_path,
                filetype=file.mimetype or 'text/plain',
                extracted_text=extracted['text']
            )

            # Perform AI analysis
            try:
                analysis_data = ai_service.analyze_document(extracted['text'], filename)
                save_analysis(
                    doc_id=doc_id,
                    summary=analysis_data.get('short_summary', ''),
                    key_info=analysis_data.get('key_information', {}),
                    important_clauses=analysis_data.get('important_clauses', []),
                    full_analysis=analysis_data
                )
            except Exception as ai_err:
                print(f"AI analysis warning: {ai_err}")

            flash('Document uploaded and analyzed successfully!', 'success')
            return redirect(url_for('dashboard', doc_id=doc_id))

        except ValueError as val_err:
            flash(str(val_err), 'error')
            if os.path.exists(save_path):
                os.remove(save_path)
            return redirect(request.url)
        except Exception as e:
            flash(f'An unexpected error occurred while parsing the file: {str(e)}', 'error')
            return redirect(request.url)

    return render_template('upload.html')

@app.route('/dashboard/<int:doc_id>')
def dashboard(doc_id):
    """Document Dashboard showing summaries, key info, clauses, review points, and Q&A."""
    doc = get_document(doc_id)
    if not doc:
        flash('Document not found.', 'error')
        return redirect(url_for('index'))

    analysis_row = get_analysis(doc_id)
    analysis = None
    if analysis_row and analysis_row['analysis']:
        try:
            analysis = json.loads(analysis_row['analysis'])
        except Exception:
            analysis = None

    conversations = get_conversations(doc_id)
    return render_template('dashboard.html', doc=doc, analysis=analysis, conversations=conversations)

@app.route('/document/<int:doc_id>')
def view_document_text(doc_id):
    """View raw extracted document text."""
    doc = get_document(doc_id)
    if not doc:
        flash('Document not found.', 'error')
        return redirect(url_for('index'))
    return render_template('document.html', doc=doc)

@app.route('/chat/<int:doc_id>', methods=['POST'])
def chat(doc_id):
    """Answers questions grounded in the uploaded document."""
    doc = get_document(doc_id)
    if not doc:
        return jsonify({"error": "Document not found"}), 404

    data = request.get_json() or {}
    question = data.get('question', '').strip()
    if not question:
        return jsonify({"error": "Question is required"}), 400

    conversations = get_conversations(doc_id)
    history = [{"role": "user", "content": c['question']} for c in conversations]

    result = ai_service.ask_question(doc['extracted_text'], question, history)
    answer = result.get('answer', "I couldn't find a clear answer to that question in the uploaded document.")

    conv_id = save_conversation(doc_id, question, answer)

    return jsonify({
        "id": conv_id,
        "question": question,
        "answer": answer,
        "source_section": result.get('source_section'),
        "quote_snippet": result.get('quote_snippet'),
        "found_in_document": result.get('found_in_document', False)
    })

@app.route('/delete/<int:doc_id>', methods=['POST'])
def delete_doc(doc_id):
    """Deletes a document and its data."""
    doc = get_document(doc_id)
    if doc and os.path.exists(doc['filepath']):
        try:
            os.remove(doc['filepath'])
        except OSError:
            pass
    delete_document(doc_id)
    flash('Document deleted.', 'info')
    return redirect(url_for('index'))

@app.route('/dictionary')
def legal_dictionary():
    """Educational legal dictionary page."""
    terms = [
        {"term": "Indemnity", "meaning": "A promise to pay for damages or legal costs if a specified problem occurs.", "example": "A vendor reimbursing legal fees if their software infringes a patent."},
        {"term": "Jurisdiction", "meaning": "Which court and state laws govern disputes under the contract.", "example": "Disputes shall be settled exclusively in courts of Delaware."},
        {"term": "Limitation of Liability", "meaning": "A ceiling on the maximum damages one party can collect from another.", "example": "Total liability shall not exceed the fees paid in the past 12 months."},
        {"term": "Arbitration", "meaning": "Resolving a legal dispute through a private arbitrator instead of a public court.", "example": "Submitting claims to an American Arbitration Association arbitrator."},
        {"term": "Confidentiality", "meaning": "An obligation not to disclose non-public company information.", "example": "Protecting source code, pricing sheets, and customer lists from competitors."},
        {"term": "Force Majeure", "meaning": "Unforeseeable external events (natural disasters, war) excusing performance.", "example": "A hurricane destroying power lines and delaying product shipments."},
        {"term": "Liquidated Damages", "meaning": "A fixed predetermined cash penalty for a specific breach.", "example": "Paying $200 per day for construction delays past the delivery date."},
        {"term": "Termination for Cause", "meaning": "Canceling the contract because the other party breached obligations.", "example": "Terminating after 30 days of non-payment of invoices."},
        {"term": "Severability", "meaning": "If one clause is found invalid by a court, the rest of the contract remains in effect.", "example": "Removing an overly restrictive non-compete while keeping the employment contract."}
    ]
    return render_template('dictionary.html', terms=terms)

@app.route('/export/<int:doc_id>')
def export_report(doc_id):
    """Downloads plain-text summary report for document."""
    doc = get_document(doc_id)
    if not doc:
        return "Document not found", 404
    analysis_row = get_analysis(doc_id)
    if not analysis_row or not analysis_row['analysis']:
        return "Analysis not found", 404

    analysis = json.loads(analysis_row['analysis'])
    report_text = format_analysis_summary(analysis)
    return Response(
        report_text,
        mimetype="text/plain",
        headers={"Content-Disposition": f"attachment;filename=LegalEase_{doc['filename']}_report.txt"}
    )

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"LegalEase Flask Application starting on http://127.0.0.1:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
