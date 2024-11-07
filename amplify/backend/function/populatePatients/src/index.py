import csv
import json
import boto3
import os
import logging
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, or_, and_
from sqlalchemy.exc import SQLAlchemyError
from patient_shared_functions.db_client import DatabaseConnectionPool
from patient_shared_functions.sqlalchemy_models import Condition, Encounter, Medication, Patient

# Configure logging
# You can adjust the level to DEBUG for more detailed logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

Base = declarative_base()

db_pool = DatabaseConnectionPool()

# Create an SQLAlchemy engine using the psycopg2 connection
def get_engine_from_connection(conn):
    return create_engine('postgresql+psycopg2://', creator=lambda: conn)


def download_csv_from_s3(bucket_name, file_key, download_path):
    s3_client = boto3.client('s3')
    s3_client.download_file(bucket_name, file_key, download_path)

def lambda_handler(event, context):
    try:
        # Define S3 bucket and file keys
        bucket_name = 'amplify-idg3dev-dev-dccb7-deployment'
        patient_file_key = 'BackupFiles/patient.csv'
        encounter_file_key = 'BackupFiles/encounter.csv'
        condition_file_key = 'BackupFiles/conditions.csv'
        medication_file_key = 'BackupFiles/medications.csv'

        # Download CSV files from S3 to /tmp directory
        download_csv_from_s3(bucket_name, patient_file_key, '/tmp/patient.csv')
        download_csv_from_s3(bucket_name, encounter_file_key, '/tmp/encounter.csv')
        download_csv_from_s3(bucket_name, condition_file_key, '/tmp/conditions.csv')
        download_csv_from_s3(bucket_name, medication_file_key, '/tmp/medications.csv')
        
        print(f"copied the files to temporary location")
        print(f"read the csv data")
        
        # Get a DB connection from the pool
        connection = db_pool.get_connection()
        try:
            engine = get_engine_from_connection(connection)
            Session = sessionmaker(bind=engine)
            session = Session()

            # Insert data from patients.csv
            with open('/tmp/patient.csv', 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                patients = []
                for row in reader:
                    # print(row)  # Log the row data
                    patients.append(Patient(
                            id=row['id'], first_name=row['first_name'], last_name=row['last_name'], 
                            date_of_birth=row['date_of_birth'], race=row['race'], gender=row['gender'], 
                            status=row['status'], email=row['email'], address=row['address'], 
                            created_at=row['created_at']
                        )
                    )
            session.bulk_save_objects(patients)
            session.commit()
            print(f"Inserted  the patient to DB")
            # print(f"Inserted the patients data from temporary location ")
            # Insert data from encounters.csv
            with open('/tmp/encounter.csv', 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                encounters = []
                for row in reader:
                    # print(row)  # Log the row data
                    encounters.append(Encounter(
                            id=row['id'], patient_id=row['patient_Id'], encounter_date=row['encounter_date'], 
                            reason=row['reason'], created_at=row['created_at']
                        )
                    )
            session.bulk_save_objects(encounters)
            session.commit()
            print(f"Inserted  the encounters to DB")
            # print(f"Inserted the encounters data from temporary location ")
            # Insert data from conditions.csv
            with open('/tmp/conditions.csv', 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                conditions = []
                for row in reader:
                    # print(row)  # Log the row data
                    conditions .append(Condition(
                            id=row['id'], encounter_id=row['encounter_id'], condition_code=row['condition_code'], 
                            diagnosed_at=row['diagnosed_at']
                        )
                    )
            session.bulk_save_objects(conditions)
            session.commit()
            
            # print(f"Inserted the conditions data from temporary location ")
            # Insert data from medications.csv
            with open('/tmp/medications.csv', 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                medications = []
                for row in reader:
                    # print(row)  # Log the row data
                    medications.append(Medication(
                            id=row['id'], encounter_id=row['encounter_id'], medication_name=row['medication_name'], 
                            dosage=row['dosage'], start_date=row['start_date'], end_date=row['end_date']
                        )
                   )
            session.bulk_save_objects(medications)
            session.commit()
            
            # print(f"Inserted the medications data from temporary location ")
        finally:
            connection.close()

        # Delete temporary files
        os.remove('/tmp/patient.csv')
        os.remove('/tmp/encounter.csv')
        os.remove('/tmp/conditions.csv')
        os.remove('/tmp/medications.csv')

        return {
            'statusCode': 200,
            'body': json.dumps('Data inserted successfully!')
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error inserting data: {str(e)}')
        }