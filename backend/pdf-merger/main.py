# backend/main.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
from PyPDF2 import PdfMerger
import io

app = FastAPI()

# Enable CORS so your frontend (running on different origin) can access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend domain for security in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/merge-pdf")
async def merge_pdf(files: list[UploadFile] = File(...)):
    if len(files) < 2:
        raise HTTPException(status_code=400, detail="At least two PDF files are required")

    merger = PdfMerger()

    try:
        for file in files:
            if file.content_type != "application/pdf":
                raise HTTPException(status_code=400, detail="Only PDF files are allowed")
            contents = await file.read()
            merger.append(io.BytesIO(contents))
        
        merged_pdf = io.BytesIO()
        merger.write(merged_pdf)
        merger.close()
        merged_pdf.seek(0)

        headers = {
            "Content-Disposition": 'attachment; filename="merged.pdf"'
        }
        return StreamingResponse(merged_pdf, media_type="application/pdf", headers=headers)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to merge PDFs: {str(e)}")
