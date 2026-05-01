from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from core.password_logic import generate_secure_password, check_password_strength

app = FastAPI(title="Password-co API")

# --- CORS Configuration ---
# This allows your frontend (HTML/JS) to talk to this backend.
# In a real production app, you would replace "*" with your actual domain.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Data Models ---
class StrengthRequest(BaseModel):
    password: str

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Password-co API is running. Visit /docs for documentation."}

@app.get("/api/generate")
def get_password(
    length: int = Query(16, ge=8, le=64),
    symbols: bool = True,
    numbers: bool = True
):
    """Endpoint to generate a secure password."""
    password = generate_secure_password(length, symbols, numbers)
    # We also check the strength of the generated password before sending it back
    strength_info = check_password_strength(password)
    
    return {
        "password": password,
        "strength": strength_info
    }

@app.post("/api/check")
def post_check_strength(request: StrengthRequest):
    """Endpoint to check the strength of a user-provided password."""
    return check_password_strength(request.password)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
