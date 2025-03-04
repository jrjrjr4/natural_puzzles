from supabase import create_client, Client
from src.core.config import settings
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Global Supabase client instance
_supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Get or initialize the Supabase client.
    
    Returns:
        Client: Supabase client instance
    """
    global _supabase_client
    
    if _supabase_client is None:
        logger.info("Initializing Supabase client")
        
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY.get_secret_value():
            logger.error("Supabase URL or key not set")
            raise ValueError("Supabase URL and key must be set")
        
        _supabase_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_KEY.get_secret_value()
        )
    
    return _supabase_client


async def execute_query(table: str, query_fn, **kwargs):
    """
    Execute a query against Supabase.
    
    Args:
        table: Table name
        query_fn: Function to apply to the query (e.g., select, insert)
        **kwargs: Additional query parameters
        
    Returns:
        Query result
    """
    client = get_supabase_client()
    query = client.table(table)
    
    # Apply the query function (e.g., select, insert)
    query = query_fn(query)
    
    # Apply additional query parameters
    for key, value in kwargs.items():
        if key == "filters" and isinstance(value, list):
            for filter_tuple in value:
                if len(filter_tuple) == 3:
                    column, operator, filter_value = filter_tuple
                    query = query.filter(column, operator, filter_value)
        elif key == "order":
            query = query.order(value[0], desc=value[1] if len(value) > 1 else False)
        elif key == "limit":
            query = query.limit(value)
        elif key == "offset":
            query = query.offset(value)
    
    # Execute the query
    response = query.execute()
    
    if hasattr(response, "error") and response.error:
        logger.error(f"Supabase query error: {response.error}")
        raise Exception(f"Supabase query error: {response.error}")
    
    return response.data 