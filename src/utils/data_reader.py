import json
from datetime import datetime
import os  
import re

# Format of garmin data: Aktivitetstype,Dato,Favoritt,Tittel,Distanse,Totale kalorier,Tid,Gjennomsnittlig puls,Makspuls,Aerob treningseffekt,Gjennomsnittlig frekvens for loping,Maksimal frekvens for løping,Gjennomsnittlig tempo,Beste tempo,Total stigning,Totalt fall,Gjennomsnittlig skrittlengde,Gjennomsnittlig vertikalt forholdstall,Gjennomsnittlig vertikal oscillasjon,Gjennomsnittlig tid med bakkekontakt,Gjennomsnittlig balanse for tid med bakkekontakt,Training Stress Score®,Gjennomsnittlig kraft,Maksimal kraft,Vanskelighetsgrad,Flyt,Gjennomsnittlig Swolf,Gjennomsnittlig tempo for tak,Totalt antall repetisjoner,Dykketid,Minimumstemperatur,Overflateintervall,Dekompresjon,Beste rundetid,Antall runder,Makstemperatur,Distanse,Totalt fall,Tid i bevegelse,Medgått tid,Minste høyde,Maksimal høyde


def time_to_seconds(time_string):
    if time_string is None:
        return None
    hours, minutes, seconds = map(int, time_string.split(':'))
    total_seconds = hours * 3600 + minutes * 60 + seconds
    return total_seconds

def replace_with_none(value):
    if value is None or value == "0" or value == "--":
        return None
    return value

def convert_to_number(value):
    if value is None:
        return None
    try:
        result = int(value)
    except ValueError:
        try:
            result = float(value)
        except ValueError:
            result = None
    return result

def pace_to_mps(pace_string):
    if pace_string is None:
        return None
    minutes, seconds = map(int, pace_string.split(':'))
    pace_seconds = minutes * 60 + seconds
    meters_per_second = 1000 / pace_seconds
    return meters_per_second


def convert_csv_to_json(csv_file_path):
    json_data = []

    with open(csv_file_path, newline='', encoding='utf-8') as csvfile:
        csv_data = csvfile.read()
        csv_data = list(csv_data.splitlines())
        for i in range(len(csv_data)):
            csv_data[i] = csv_data[i].replace('\"', '')

            if i == 0:
                continue

            pattern = r',(\d),(\d{3}),'
            csv_data[i] = re.sub(pattern, r',\1.\2,', csv_data[i])

            record_lst = list(csv_data[i].split(','))

            date_time_obj = datetime.strptime(record_lst[1], '%Y-%m-%d %H:%M:%S')

            json_record = {
                "Activity Description": replace_with_none(record_lst[0]),
                "Activity ID": int(date_time_obj.timestamp()),
                "Activity Name": replace_with_none(record_lst[3]),
                "Activity Type": replace_with_none("Run" if record_lst[0] == "Løping" else record_lst[0]),
                "Average Cadence": convert_to_number(replace_with_none(record_lst[10])),
                "Average Speed": pace_to_mps(replace_with_none(record_lst[12])),
                "Calories": convert_to_number(replace_with_none(record_lst[5])),
                "DateTime": date_time_obj.strftime('%Y-%m-%d'),
                "Distance": convert_to_number(replace_with_none(record_lst[4])),
                "Elevation Gain": convert_to_number(replace_with_none(record_lst[14])),
                "Elevation Loss": convert_to_number(replace_with_none(record_lst[15])),
                "Max Heart Rate": convert_to_number(replace_with_none(record_lst[8])),
                "Max Speed": None,
                "Moving Time": replace_with_none(time_to_seconds(record_lst[6])),
                "Time": date_time_obj.strftime('%I:%M:%S %p')
            }

            if json_record["Average Cadence"] is not None:
                json_record["Average Cadence"] = json_record["Average Cadence"] / 2

            json_data.append(json_record)

    return json_data



def append_csv_to_existing_json(existing_json_path, csv_file_path):
    with open(existing_json_path, 'r', encoding='utf-8') as jsonfile:
        existing_data = json.load(jsonfile)
    
    new_data = convert_csv_to_json(csv_file_path)
    existing_data.extend(new_data)
    
    with open(existing_json_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(existing_data, jsonfile, indent=2, ensure_ascii=False)

def save_to_json_file(data, output_json_path):
    with open(output_json_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=2, ensure_ascii=False)






csv_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'garmin_activities.csv')
json_data = convert_csv_to_json(csv_file_path)
save_to_json_file(json_data, '_activities.json')

