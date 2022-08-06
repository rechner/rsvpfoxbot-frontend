FROM tiangolo/meinheld-gunicorn-flask:python3.8
COPY ./app /app
COPY requirements.txt /app
RUN pip install --upgrade pip
RUN pip install -r /app/requirements.txt
