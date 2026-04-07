from sqlmodel import Session, select
from models import Expense

def create_expense(session: Session, expense: Expense) -> Expense:
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense

def get_all_expenses(session: Session) -> list[Expense]:
    return session.exec(select(Expense)).all()

def get_expense_by_id(session: Session, expense_id: int) -> Expense | None:
    return session.get(Expense, expense_id)

def update_expense(session: Session, expense_id: int, new_data: Expense) -> Expense | None:
    expense = session.get(Expense, expense_id)
    if expense:
        expense.title = new_data.title
        expense.category = new_data.category
        expense.amount = new_data.amount
        expense.date = new_data.date
        expense.description = new_data.description
        session.add(expense)
        session.commit()
        session.refresh(expense)
    return expense

def delete_expense(session: Session, expense_id: int) -> bool:
    expense = session.get(Expense, expense_id)
    if expense:
        session.delete(expense)
        session.commit()
        return True
    return False