import sqlite3
import os
import json
from datetime import datetime

DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database')
DB_PATH = os.path.join(DB_DIR, 'legalease.db')

def get_db_connection():
    """Returns a sqlite3 connection with Row factory enabled."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db():
    """Initializes tables for documents, analyses, and conversations."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL,
        filetype TEXT NOT NULL,
        extracted_text TEXT NOT NULL,
        created_at TEXT NOT NULL
    );
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS analyses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        summary TEXT,
        key_information TEXT,
        important_clauses TEXT,
        analysis TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
    );
    ''')

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS conversations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        document_id INTEGER NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (document_id) REFERENCES documents (id) ON DELETE CASCADE
    );
    ''')

    conn.commit()
    conn.close()

def save_document(filename: str, filepath: str, filetype: str, extracted_text: str) -> int:
    """Inserts a new document record and returns its id."""
    conn = get_db_connection()
    cursor = conn.cursor()
    created_at = datetime.utcnow().isoformat()
    cursor.execute('''
        INSERT INTO documents (filename, filepath, filetype, extracted_text, created_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (filename, filepath, filetype, extracted_text, created_at))
    doc_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return doc_id

def get_document(doc_id: int):
    """Retrieves document record by id."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents WHERE id = ?', (doc_id,))
    row = cursor.fetchone()
    conn.close()
    return row

def get_all_documents():
    """Retrieves all documents sorted by creation date."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM documents ORDER BY id DESC')
    rows = cursor.fetchall()
    conn.close()
    return rows

def delete_document(doc_id: int):
    """Deletes a document and its cascading analyses/conversations."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM documents WHERE id = ?', (doc_id,))
    conn.commit()
    conn.close()

def save_analysis(doc_id: int, summary: str, key_info: dict, important_clauses: list, full_analysis: dict):
    """Saves or updates document analysis."""
    conn = get_db_connection()
    cursor = conn.cursor()
    created_at = datetime.utcnow().isoformat()

    cursor.execute('DELETE FROM analyses WHERE document_id = ?', (doc_id,))
    cursor.execute('''
        INSERT INTO analyses (document_id, summary, key_information, important_clauses, analysis, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        doc_id,
        summary,
        json.dumps(key_info),
        json.dumps(important_clauses),
        json.dumps(full_analysis),
        created_at
    ))
    conn.commit()
    conn.close()

def get_analysis(doc_id: int):
    """Retrieves the analysis record for a document."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analyses WHERE document_id = ?', (doc_id,))
    row = cursor.fetchone()
    conn.close()
    return row

def save_conversation(doc_id: int, question: str, answer: str) -> int:
    """Stores a Q&A conversation entry."""
    conn = get_db_connection()
    cursor = conn.cursor()
    created_at = datetime.utcnow().isoformat()
    cursor.execute('''
        INSERT INTO conversations (document_id, question, answer, created_at)
        VALUES (?, ?, ?, ?)
    ''', (doc_id, question, answer, created_at))
    conv_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return conv_id

def get_conversations(doc_id: int):
    """Retrieves all conversations for a document."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM conversations WHERE document_id = ? ORDER BY id ASC', (doc_id,))
    rows = cursor.fetchall()
    conn.close()
    return rows
