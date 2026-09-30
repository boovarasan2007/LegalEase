import os
import json
from typing import Dict, Any, List

SYSTEM_PROMPT = """You are LegalEase, an AI assistant that helps users understand legal documents in plain language.
Your task is to explain the provided document accurately and clearly.

Rules:
1. Use the document as the primary source.
2. Never invent facts, clauses, dates, parties, or legal requirements.
3. If information is not present, clearly say that it was not found (e.g. "Not found in the document.").
4. Distinguish between what the document says and general legal information.
5. Do not present your response as legal advice.
6. Explain complex legal language in simple terms.
7. When possible, identify the relevant section, clause, or page.
8. Preserve important qualifications and exceptions from the original document.
9. Do not change the meaning of contractual language while simplifying it.
10. Use neutral language for risks: use phrases like "This clause may deserve closer review" instead of saying "This clause is illegal".
11. Encourage the user to consult a qualified lawyer for decisions requiring legal advice."""

class LegalEaseAIService:
    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")

    def is_configured(self) -> bool:
        return bool(self.gemini_key or self.openai_key)

    def analyze_document(self, text: str, filename: str) -> Dict[str, Any]:
        """Analyzes full legal document into summaries, key info, simplified clauses, and review points."""
        truncated_text = text[:60000] if len(text) > 60000 else text

        prompt = f"""Analyze the following legal document named "{filename}".
Extract and return a valid JSON object matching this structure:
{{
  "document_type": "string",
  "document_purpose": "string",
  "short_summary": "2-3 sentence plain English executive summary",
  "detailed_summary": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
  "key_information": {{
    "parties": "Parties or 'Not found in the document.'",
    "effective_date": "Date or 'Not found in the document.'",
    "expiration_date": "Term or 'Not found in the document.'",
    "monetary_amounts": "Fees/amounts or 'Not found in the document.'",
    "deadlines": "Deadlines or 'Not found in the document.'",
    "obligations": ["obligation 1", "obligation 2"],
    "rights": ["right 1", "right 2"],
    "termination_conditions": "Termination conditions or 'Not found in the document.'",
    "penalties_and_remedies": "Penalties or 'Not found in the document.'",
    "governing_law": "Governing law or 'Not found in the document.'"
  }},
  "important_clauses": [
    {{
      "clause_title": "string",
      "original_clause": "quote from document",
      "simple_explanation": "plain english explanation",
      "why_it_matters": "practical effect",
      "things_to_check": "questions for a lawyer"
    }}
  ],
  "review_points": [
    {{
      "title": "string",
      "category": "Indemnity | Liability Limitations | Automatic Renewal | Payment & Fees | Termination | Broad Obligations | Other",
      "concern_level": "High Review | Moderate Review | Informational",
      "clause_snippet": "quote",
      "observation": "neutral statement starting with 'This clause may deserve closer review because...'",
      "recommended_verification": "what to verify with an attorney"
    }}
  ]
}}

DOCUMENT TEXT:
{truncated_text}
"""

        # Call Gemini SDK if key exists
        if self.gemini_key:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.gemini_key, http_options={'headers': {'User-Agent': 'aistudio-build'}})
            response = client.models.generate_content(
                model='gemini-3.8-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)

        # Call OpenAI SDK if OpenAI key exists
        elif self.openai_key:
            import openai
            client = openai.OpenAI(api_key=self.openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)

        else:
            # Fallback deterministic template parser when no API key is set
            return self._heuristic_analysis(text, filename)

    def ask_question(self, document_text: str, question: str, history: List[Dict[str, str]] = None) -> Dict[str, Any]:
        """Answers user question based strictly on document text."""
        truncated_text = document_text[:60000] if len(document_text) > 60000 else document_text

        prompt = f"""DOCUMENT CONTEXT:
{truncated_text}

USER QUESTION:
"{question}"

Analyze the document context to answer the question.
If found:
1. Provide a plain-language answer.
2. Quote or reference the specific section/paragraph/page.
3. Set "found_in_document": true.

If not found:
1. Return answer as "I couldn't find a clear answer to that question in the uploaded document."
2. Set "found_in_document": false.
3. Do not invent any facts.

Return JSON:
{{
  "answer": "string",
  "source_section": "section or null",
  "quote_snippet": "quote or null",
  "found_in_document": true/false
}}
"""
        if self.gemini_key:
            from google import genai
            from google.genai import types
            client = genai.Client(api_key=self.gemini_key, http_options={'headers': {'User-Agent': 'aistudio-build'}})
            response = client.models.generate_content(
                model='gemini-3.8-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    response_mime_type="application/json"
                )
            )
            return json.loads(response.text)

        elif self.openai_key:
            import openai
            client = openai.OpenAI(api_key=self.openai_key)
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)

        else:
            return {
                "answer": "AI API Key not configured. Please add GEMINI_API_KEY or OPENAI_API_KEY in .env.",
                "source_section": None,
                "quote_snippet": None,
                "found_in_document": False
            }

    def _heuristic_analysis(self, text: str, filename: str) -> Dict[str, Any]:
        """Heuristic fallback parser when running without an external AI key."""
        first_lines = "\n".join(text.split("\n")[:10])
        return {
            "document_type": "Legal Agreement / Contract",
            "document_purpose": "Specifies legal rights, duties, and covenants between the designated parties.",
            "short_summary": f"This document contains legal terms and conditions extracted from {filename}.",
            "detailed_summary": [
                "Document establishes formal contractual rights and obligations.",
                "Review the key terms, payment schedules, and termination notices.",
                "Always seek advice from a qualified attorney prior to signing."
            ],
            "key_information": {
                "parties": "Refer to the preamble or introductory paragraph of the document.",
                "effective_date": "Not found in the document.",
                "expiration_date": "Not found in the document.",
                "monetary_amounts": "Not found in the document.",
                "deadlines": "Not found in the document.",
                "obligations": ["Comply with all designated terms and specifications."],
                "rights": ["Enforce contractual remedies in event of default."],
                "termination_conditions": "Notice required pursuant to the termination clause.",
                "penalties_and_remedies": "Remedies available at law or equity.",
                "governing_law": "Check the governing law and jurisdiction clause."
            },
            "important_clauses": [
                {
                    "clause_title": "Introductory Provisions",
                    "original_clause": first_lines[:200] + "...",
                    "simple_explanation": "Identifies the core premise and background of the agreement.",
                    "why_it_matters": "Sets the scope of who is bound by these terms.",
                    "things_to_check": "Confirm the exact legal corporate names of all parties."
                }
            ],
            "review_points": [
                {
                    "title": "Review Required",
                    "category": "Other",
                    "concern_level": "Informational",
                    "clause_snippet": "Preamble and terms",
                    "observation": "This clause may deserve closer review with legal counsel.",
                    "recommended_verification": "Ensure all blanks and exhibits are filled in before execution."
                }
            ]
        }
