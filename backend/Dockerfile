FROM python:3.14.3-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    cron \
    gcc \
    build-essential \
    pkg-config \
    default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt \
    && rm -f /usr/local/lib/python3.14/site-packages/urllib3_future.pth

COPY . .

RUN echo '#!/bin/sh\n. /app/.docker_env\nexec /usr/local/bin/python -u /app/fetch_summarize.py' \
    > /app/run_fetch.sh && chmod +x /app/run_fetch.sh

# Every 1 minute, output piped directly to Docker stdout/stderr
RUN echo "*/3 * * * * root /app/run_fetch.sh >> /proc/1/fd/1 2>>/proc/1/fd/2" \
    > /etc/cron.d/fetch_summarize \
    && chmod 0644 /etc/cron.d/fetch_summarize

CMD ["sh", "-c", "printenv > /app/.docker_env && cron && echo '\n=== STARTING INITIAL EMAIL FETCH (background) ===\n' && python -u fetch_summarize.py & echo '\n=== STARTING FASTAPI ===\n' && fastapi run main.py --host 0.0.0.0 --port 8000"]