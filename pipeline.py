import fitz  # PyMuPDF
from fpdf import FPDF
import os


def read_pdf(file_path, max_chars=6000):
    """
    PDF file se saara text extract karta hai
    max_chars: Groq free tier ke liye 6000 chars safe limit hai
    """
    text = ""
    try:
        doc = fitz.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        text = f"PDF padhne mein error aaya: {str(e)}"

    # Groq free tier token limit ke liye trim karo
    if len(text) > max_chars:
        text = text[:max_chars] + "\n\n[Note: Document truncated due to token limits.]"

    return text


def save_summary_to_pdf(summary_text, output_path):
    """
    Summary text ko PDF file mein save karta hai
    """
    try:
        # summaries folder exist nahi karta toh bana do
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        pdf = FPDF()
        pdf.set_margins(15, 15, 15)
        pdf.add_page()

        # Title
        pdf.set_font("Arial", style="B", size=14)
        pdf.cell(0, 10, txt="AI Lawyer - Case Summary", ln=True, align="C")
        pdf.ln(8)

        # Summary content
        pdf.set_font("Arial", size=10)

        # Text ko line by line likhna (encoding fix ke saath)
        for line in summary_text.split("\n"):
            # Special characters ko handle karna
            safe_line = line.encode("latin-1", errors="replace").decode("latin-1")
            pdf.multi_cell(0, 7, txt=safe_line)

        pdf.output(output_path)
        return True

    except Exception as e:
        print(f"PDF save karne mein error: {str(e)}")
        return False