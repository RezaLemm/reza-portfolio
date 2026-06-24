import argparse
from pathlib import Path
import sys

try:
    import fitz
except ImportError:
    print("PyMuPDF is not installed. Run: python -m pip install pymupdf", file=sys.stderr)
    sys.exit(1)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True)
    parser.add_argument("--out", required=True)
    parser.add_argument("--dpi", default="180")
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    out_dir = Path(args.out)
    dpi = int(args.dpi)

    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)

    out_dir.mkdir(parents=True, exist_ok=True)

    for old_file in out_dir.glob("page-*.png"):
        old_file.unlink()

    doc = fitz.open(str(pdf_path))
    zoom = dpi / 72
    matrix = fitz.Matrix(zoom, zoom)

    for index, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        output = out_dir / f"page-{index:03d}.png"
        pix.save(str(output))

    print(f"Converted {len(doc)} page(s) to {out_dir}")

if __name__ == "__main__":
    main()