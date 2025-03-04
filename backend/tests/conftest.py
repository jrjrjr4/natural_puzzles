import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add the parent directory to the path so we can import the main module
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app


@pytest.fixture
def client():
    """
    Create a test client for the FastAPI application.
    
    This fixture can be used in tests to make requests to the API.
    """
    with TestClient(app) as test_client:
        yield test_client 