import os
from datetime import datetime

from flask import Flask, render_template, request, jsonify
from influxdb import InfluxDBClient


app = Flask(__name__)
db_client = InfluxDBClient(os.environ.get("INFLUX_HOST", "localhost"))
db_client.create_database("covid_check")
db_client.create_retention_policy("covid_check", "1d", 1, "covid_check", True)

@app.route('/')
def index():  # put application's code here
    return render_template("symptoms-check.html")

def timestamp():
    now = datetime.utcnow()
    return now.isoformat("T") + "Z"

@app.post('/record')
def record():
    data = request.get_json()
    document = {
        "measurement": "risk",
        "tags": {
            "telegram_id": data['id'],
        },
        "time": timestamp(),
        "fields": {
            "risk": data['risk'],
        }
    }
    db_client.write_points([document], database="covid_check")
    return jsonify({"success": True})


if __name__ == '__main__':
    app.run()
