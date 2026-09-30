import os
import pytest
import tempfile
from services.document_parser import normalize_text, extract_txt_text, extract_document_text
from services.database import (
    init_db,
    save_document,
    get_document,
    save_analysis,
    get_analysis,
    save_conversation,
    get_conversations,
    delete_document
)
from services.ai_service import LegalEaseAIService

@pytest.fixture
def temp_txt_file():
    with tempfile.NamedTemporaryFile(suffix='.txt', mode='w+', encoding='utf-8', delete=False) as f:
        f.write("CONFIDENTIALITY AGREEMENT\n\nThis agreement is made between Party A and Party B.")
        path = f.name
    yield path
    if os.path.exists(path):
        os.remove(path)

@pytest.fixture
def temp_empty_file():
    with tempfile.NamedTemporaryFile(suffix='.txt', mode='w+', encoding='utf-8', delete=False) as f:
        f.write("   \n\n  ")
        path = f.name
    yield path
    if os.path.exists(path):
        os.remove(path)

def test_normalize_text():
    raw = "Section 1.   Title  \r\n\r\n\r\n\r\nObligations: Pay on   time."
    cleaned = normalize_text(raw)
    assert "Section 1. Title" in cleaned
    assert "\n\n\n" not in cleaned
    assert "Pay on time." in cleaned

def test_txt_extraction(temp_txt_file):
    res = extract_document_text(temp_txt_file, "sample.txt")
    assert "CONFIDENTIALITY AGREEMENT" in res["text"]
    assert res["word_count"] > 5
    assert res["char_count"] > 20

def test_empty_document_handling(temp_empty_file):
    with pytest.raises(ValueError) as excinfo:
        extract_document_text(temp_empty_file, "empty.txt")
    assert "could not extract readable text" in str(excinfo.value)

def test_invalid_file_extension():
    with pytest.raises(ValueError) as excinfo:
        extract_document_text("fake.exe", "fake.exe")
    assert "Unsupported file format" in str(excinfo.value)

def test_database_operations():
    init_db()
    doc_id = save_document("test.txt", "/tmp/test.txt", "text/plain", "Sample extracted text.")
    assert doc_id > 0

    doc = get_document(doc_id)
    assert doc is not None
    assert doc["filename"] == "test.txt"

    # Analysis operations
    save_analysis(
        doc_id=doc_id,
        summary="Test summary",
        key_info={"parties": "Party A and Party B"},
        important_clauses=[],
        full_analysis={"short_summary": "Test summary"}
    )
    analysis = get_analysis(doc_id)
    assert analysis is not None
    assert "Test summary" in analysis["summary"]

    # Conversation operations
    conv_id = save_conversation(doc_id, "What is this?", "A test document.")
    assert conv_id > 0
    convs = get_conversations(doc_id)
    assert len(convs) == 1
    assert convs[0]["question"] == "What is this?"

    # Cleanup
    delete_document(doc_id)
    assert get_document(doc_id) is None

def test_ai_service_fallback():
    ai = LegalEaseAIService()
    # Test fallback behavior when no API key is provided
    res = ai.analyze_document("Party A agrees to pay Party B $1,000.", "agreement.txt")
    assert "document_type" in res
    assert "short_summary" in res
    assert "key_information" in res
