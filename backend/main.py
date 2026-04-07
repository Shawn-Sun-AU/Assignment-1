from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session
from typing import List
from contextlib import asynccontextmanager
from database import engine, get_session
from models import Expense, SQLModel
from crud import create_expense, get_all_expenses, get_expense_by_id, update_expense, delete_expense

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(lifespan=lifespan)

@app.post("/expenses", response_model=Expense)
def add_expense(expense: Expense, session: Session = Depends(get_session)):
    return create_expense(session, expense)

@app.get("/expenses", response_model=List[Expense])
def list_expenses(session: Session = Depends(get_session)):
    return get_all_expenses(session)

@app.get("/expenses/{expense_id}", response_model=Expense)
def get_expense(expense_id: int, session: Session = Depends(get_session)):
    expense = get_expense_by_id(session, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return expense

@app.put("/expenses/{expense_id}", response_model=Expense)
def modify_expense(expense_id: int, expense: Expense, session: Session = Depends(get_session)):
    updated = update_expense(session, expense_id, expense)
    if not updated:
        raise HTTPException(status_code=404, detail="Expense not found")
    return updated

@app.delete("/expenses/{expense_id}")
def remove_expense(expense_id: int, session: Session = Depends(get_session)):
    success = delete_expense(session, expense_id)
    if not success:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"ok": True}
