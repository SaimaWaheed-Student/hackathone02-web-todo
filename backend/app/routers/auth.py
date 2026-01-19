from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.database import get_session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: Session = Depends(get_session),
) -> User:
    """Register a new user.

    - Validates email uniqueness
    - Hashes password before storage
    - Returns created user (without password)
    """
    # Check if email already exists
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user with hashed password
    user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@router.post("/signin", response_model=TokenResponse)
async def signin(
    credentials: UserLogin,
    session: Session = Depends(get_session),
) -> TokenResponse:
    """Authenticate user and return JWT token.

    - Verifies email exists and password matches
    - Returns same error message for wrong email or password (FR-023)
    - Issues JWT token on success
    """
    # Find user by email
    user = session.exec(
        select(User).where(User.email == credentials.email)
    ).first()

    # Verify credentials - same message for wrong email/password
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    # Create and return access token
    access_token = create_access_token(user.id, user.email)

    return TokenResponse(access_token=access_token, token_type="bearer")
