import json
from patient_shared_functions.db_client import DatabaseConnectionPool
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)  # You can adjust the level to DEBUG for more detailed logs
logger = logging.getLogger(__name__)

db_pool = DatabaseConnectionPool()

def lambda_handler(event, context):
    connection = None
    try:
        connection = db_pool.get_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM patients;")
            results = cursor.fetchall()
            return {
                'statusCode': 200,
                'body': json.dumps(results)
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if connection:
            db_pool.return_connection(connection)

if __name__ == "__main__":
    with open('event.json') as f:
        mock_event = json.load(f)
    print(lambda_handler(mock_event, None))  # Call lambda_handler with mock event
