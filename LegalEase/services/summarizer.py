import json
from typing import Dict, Any

def format_analysis_summary(analysis_dict: Dict[str, Any]) -> str:
    """Formats the document analysis into a clean text report suitable for printing or export."""
    short_summary = analysis_dict.get("short_summary", "No summary available.")
    purpose = analysis_dict.get("document_purpose", "Not specified.")
    key_info = analysis_dict.get("key_information", {})

    lines = [
        "=====================================================",
        "LEGALEASE ANALYSIS REPORT",
        "=====================================================",
        f"Document Type: {analysis_dict.get('document_type', 'Contract')}",
        f"Purpose: {purpose}",
        "",
        "SUMMARY:",
        short_summary,
        "",
        "KEY INFORMATION:",
        f"• Parties: {key_info.get('parties', 'Not found in the document.')}",
        f"• Effective Date: {key_info.get('effective_date', 'Not found in the document.')}",
        f"• Expiration / Term: {key_info.get('expiration_date', 'Not found in the document.')}",
        f"• Monetary Amounts: {key_info.get('monetary_amounts', 'Not found in the document.')}",
        f"• Deadlines: {key_info.get('deadlines', 'Not found in the document.')}",
        f"• Termination: {key_info.get('termination_conditions', 'Not found in the document.')}",
        f"• Governing Law: {key_info.get('governing_law', 'Not found in the document.')}",
        "",
        "DISCLAIMER:",
        "LegalEase provides general informational assistance and is not a substitute for advice from a qualified lawyer.",
        "====================================================="
    ]
    return "\n".join(lines)
