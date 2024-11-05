import json
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, or_, and_
from sqlalchemy.exc import SQLAlchemyError
from patient_shared_functions.db_client import DatabaseConnectionPool
import logging
from patient_shared_functions.sqlalchemy_models import Condition, Encounter, Medication, Patient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection pool instance
db_pool = DatabaseConnectionPool()

# Create SQLAlchemy engine using a given connection
def get_engine_from_connection(conn):
    return create_engine('postgresql+psycopg2://', creator=lambda: conn)

# Mapping camelCase fields to snake_case for SQLAlchemy model attributes
FIELD_MAP = {
    'firstName': 'first_name',
    'lastName': 'last_name',
    'dateOfBirth': 'date_of_birth',
    'gender': 'gender',
    'race': 'race',
    'email': 'email',
    'address': 'address',
    'status': 'status',
    'createdAt': 'created_at',
    'encounterDate': 'encounter_date',
    'reason': 'reason',
    'conditionCode': 'condition_code',
    'diagnosedAt': 'diagnosed_at',
    'medicationName': 'medication_name',
    'dosage': 'dosage',
    'startDate': 'start_date',
    'endDate': 'end_date',
}

# Build SQLAlchemy query based on filters
def build_search_query(filters, session):
    # Start with the Patient model and perform LEFT OUTER JOINs
    query = session.query(Patient)\
        .outerjoin(Encounter, Patient.id == Encounter.patient_id)\
        .outerjoin(Condition, Encounter.id == Condition.encounter_id)\
        .outerjoin(Medication, Encounter.id == Medication.encounter_id)

    for field, value in filters.items():
        # Convert camelCase to snake_case
        snake_case_field = FIELD_MAP.get(field, field)

        if field == 'unifiedSearch':
            # Perform a unified search across multiple fields with ilike
            search_term = f"%{value}%"
            query = query.filter(or_(
                Patient.first_name.ilike(search_term),
                Patient.last_name.ilike(search_term),
                Patient.email.ilike(search_term),
                Patient.address.ilike(search_term),
                Encounter.reason.ilike(search_term),
                Condition.condition_code.ilike(search_term),
                Medication.medication_name.ilike(search_term)
            ))
        elif hasattr(Patient, snake_case_field):
            # Apply ilike for string-based fields
            if isinstance(value, str):
                query = query.filter(getattr(Patient, snake_case_field).ilike(f"%{value}%"))
            else:
                query = query.filter(getattr(Patient, snake_case_field) == value)
        elif hasattr(Encounter, snake_case_field):
            # Apply ilike for string-based fields
            if isinstance(value, str):
                query = query.filter(getattr(Encounter, snake_case_field).ilike(f"%{value}%"))
            else:
                query = query.filter(getattr(Encounter, snake_case_field) == value)
        elif hasattr(Condition, snake_case_field):
            # Apply ilike for string-based fields
            if isinstance(value, str):
                query = query.filter(getattr(Condition, snake_case_field).ilike(f"%{value}%"))
            else:
                query = query.filter(getattr(Condition, snake_case_field) == value)
        elif hasattr(Medication, snake_case_field):
            # Apply ilike for string-based fields
            if isinstance(value, str):
                query = query.filter(getattr(Medication, snake_case_field).ilike(f"%{value}%"))
            else:
                query = query.filter(getattr(Medication, snake_case_field) == value)

    return query

# Apply pagination to the query
def paginate_query(query, page, page_size):
    return query.offset((page - 1) * page_size).limit(page_size)

# Serialize the query results into camelCase format
def serialize_results(results):
    serialized_results = []
    for patient in results:
        serialized_results.append({
            'patientId': patient.id,
            'email': patient.email,
            'firstName': patient.first_name,
            'lastName': patient.last_name,
            'dateOfBirth': patient.date_of_birth.isoformat() if patient.date_of_birth else None,
            'gender': patient.gender,
            'race': patient.race,
            'address': patient.address,
            'status': patient.status,
            'createdAt': patient.created_at.isoformat() if patient.created_at else None,
            'encounters': [
                {
                    'encounterId': encounter.id,
                    'encounterDate': encounter.encounter_date.isoformat() if encounter.encounter_date else None,
                    'reason': encounter.reason,
                    'conditions': [
                        {
                            'conditionId': condition.id,
                            'conditionCode': condition.condition_code,
                            'diagnosedAt': condition.diagnosed_at.isoformat() if condition.diagnosed_at else None,
                        } for condition in encounter.conditions
                    ],
                    'medications': [
                        {
                            'medicationId': medication.id,
                            'medicationName': medication.medication_name,
                            'dosage': medication.dosage,
                            'startDate': medication.start_date.isoformat() if medication.start_date else None,
                            'endDate': medication.end_date.isoformat() if medication.end_date else None,
                        } for medication in encounter.medications
                    ],
                } for encounter in patient.encounters
            ]
        })
    return serialized_results

# Lambda function handler
def handler(event, context):
    # Ensure that the body is a JSON string
    body = event.get('body')
    
    if isinstance(body, str):
        filters = json.loads(body)  # Extract filters from POST request body
    else:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body format'})
        }

    # Safely extract page and page_size from queryStringParameters
    page = 1  # default page
    page_size = 10  # default page size

    if event.get('queryStringParameters'):
        query_params = event['queryStringParameters']
        if 'page' in query_params:
            page = int(query_params['page'])
        if 'pageSize' in query_params:
            page_size = int(query_params['pageSize'])

    connection = db_pool.get_connection()  # Get a DB connection from the pool
    try:
        engine = get_engine_from_connection(connection)
        Session = sessionmaker(bind=engine)
        session = Session()

        # Build the query with the filters applied
        query = build_search_query(filters, session)

        # Get the total count of matching records
        total_count = query.with_entities(Patient.id).distinct().count()  # Adjust this as needed for your data model

        # Apply pagination to the query
        paginated_query = paginate_query(query, page, page_size)
        results = paginated_query.all()

        # Serialize the results to camelCase format for the response
        serialized_results = serialize_results(results)

        return {
            'statusCode': 200,
            'body': json.dumps({
                'totalCount': total_count,  # Total number of records matching the filters
                'results': serialized_results  # Paginated results
            }),
            'headers': {
                'Content-Type': 'application/json'
            }
        }

    except SQLAlchemyError as e:
        logger.error(f"Error occurred: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }
    
    finally:
        db_pool.return_connection(connection)  # Return the DB connection back to the pool
