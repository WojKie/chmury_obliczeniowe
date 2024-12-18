FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update \
    && apt-get install -y postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# trzeba było dodać poniżej poprawną ścieżkę do pliku requirements.txt
COPY co_proj/requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

COPY scripts/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

CMD ["/wait-for-it.sh", "db:5432", "--", "sh", "-c", "python co_proj/manage.py migrate && python co_proj/manage.py runserver 0.0.0.0:8000"]