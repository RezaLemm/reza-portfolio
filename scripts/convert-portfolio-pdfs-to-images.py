from pathlib import Path
import fitz

ROOT = Path.cwd()

PROJECTS = [
    {
        "name": "Gazak",
        "folder": ROOT / "Photos" / "Gazak",
    },
    {
        "name": "Real Roastery",
        "folder": ROOT / "Photos" / "Real Roastery",
    },
    {
        "name": "KHANE IRANI",
        "folder": ROOT / "Photos" / "KHANE IRANI",
    },
]

ZOOM = 2.2

def find_pdf(folder: Path):
    pdfs = sorted(folder.glob("*.pdf"))
    if not pdfs:
        return None
    return pdfs[0]

def clear_old_pages(output_folder: Path):
    output_folder.mkdir(parents=True, exist_ok=True)

    for old_file in output_folder.glob("page-*.png"):
        old_file.unlink()

def convert_pdf(project):
    folder = project["folder"]
    name = project["name"]

    if not folder.exists():
        print(f"Folder missing: {folder}")
        return

    pdf_path = find_pdf(folder)

    if not pdf_path:
        print(f"No PDF found for: {name}")
        return

    output_folder = folder / "PDF Pages"
    clear_old_pages(output_folder)

    print("")
    print(f"Converting: {name}")
    print(f"PDF: {pdf_path.name}")

    doc = fitz.open(pdf_path)

    matrix = fitz.Matrix(ZOOM, ZOOM)

    for index, page in enumerate(doc, start=1):
        pix = page.get_pixmap(matrix=matrix, alpha=False)
        output_path = output_folder / f"page-{index:03}.png"
        pix.save(output_path)
        print(f"Saved: {output_path}")

    doc.close()

    print(f"Done: {name} — {len(list(output_folder.glob('page-*.png')))} pages")

def main():
    for project in PROJECTS:
        convert_pdf(project)

    print("")
    print("All PDFs converted to page images.")

if __name__ == "__main__":
    main()