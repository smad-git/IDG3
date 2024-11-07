import json
from sqlalchemy.orm import sessionmaker, joinedload
from sqlalchemy import create_engine, or_, and_, func
from sqlalchemy.exc import SQLAlchemyError
from patient_shared_functions.db_client import DatabaseConnectionPool
import logging
from datetime import datetime
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
        .outerjoin(Medication, Encounter.id == Medication.encounter_id)\
        .distinct(Patient.id)  # Ensure distinct patients are selected

    # Check if 'unifiedSearch' is in filters and handle it first
    if 'unifiedSearch' in filters:
        search_term = f"%{filters['unifiedSearch']}%"
        print(f"Applying unified search for: {search_term}")
        query = query.filter(or_(
            Patient.first_name.ilike(search_term),
            Patient.last_name.ilike(search_term),
            Patient.email.ilike(search_term),
            Patient.address.ilike(search_term),
            func.concat(Patient.first_name, ' ', Patient.last_name).ilike(search_term),  # Full name search
            Encounter.reason.ilike(search_term),
            Condition.condition_code.ilike(search_term),
            Medication.medication_name.ilike(search_term)
        ))

    # Now, process the rest of the filters
    for field, value in filters.items():
        # Skip 'unifiedSearch' as it is already processed
        if field == 'unifiedSearch':
            continue
        
        # Convert camelCase to snake_case
        snake_case_field = FIELD_MAP.get(field, field)

        if field == 'encounterDateRange':
            # Apply date range filter for encounter_date
            date_range = filters.get('encounterDateRange')

            if date_range and len(date_range) == 2:
                start_date_str, end_date_str = date_range  # Unpack the date range
                
                # Log to verify the extracted start and end date
                logger.info("Applying date range filter: %s - %s", start_date_str, end_date_str)
                
                try:
                    # Ensure that start_date and end_date are in the correct datetime format
                    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")  # Convert to datetime object
                    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")  # Convert to datetime object
                    
                    # Apply the date range filter to the query
                    query = query.filter(and_(
                        Encounter.encounter_date >= start_date,
                        Encounter.encounter_date <= end_date
                    ))

                    logger.info("Date range filter applied successfully: %s - %s", start_date, end_date)

                except ValueError as e:
                    logger.error("Error converting dates to datetime format: %s", e)
                    # Handle error or raise exception if necessary

            else:
                logger.error("Invalid date range passed: %s", date_range)
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
    print(query)
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
        filters = {}  # No filters provided

    # Safely extract page and page_size from queryStringParameters
    page = 1  # default page
    page_size = 50  # default page size

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

        # Get the total count of matching distinct patient records
        total_count = query.with_entities(Patient.id).distinct().count()

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
                 'Content-Type': 'application/json',
                 'Access-Control-Allow-Origin': '*',  
                 'Access-Control-Allow-Headers': 'Content-Type',  
                 'Access-Control-Allow-Methods': 'OPTIONS,GET,POST'  
            }
        }

    except SQLAlchemyError as e:
        logger.error(f"Error occurred: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': 'Internal server error'})
        }
    
    finally:
        # Return the DB connection back to the pool
        db_pool.return_connection(connection)
