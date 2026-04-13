import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.search import router as search_router
from app.core.config import settings
from app.core.middleware import CostTrackingMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(application: FastAPI):
    logger.info("ChinaPrice API starting up...")
    logger.info("Debug mode: %s", settings.DEBUG)
    yield
    logger.info("ChinaPrice API shutting down...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="International price comparison platform for Chinese e-commerce",
    version="0.1.0",
    debug=settings.DEBUG,
    lifespan=lifespan,
)

app.add_middleware(CostTrackingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search_router, prefix=settings.API_PREFIX)
