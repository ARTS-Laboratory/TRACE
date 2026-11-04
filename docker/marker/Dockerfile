FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    SURYA_INFERENCE_BACKEND=vllm \
    SURYA_INFERENCE_URL=http://surya:8000/v1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        libglib2.0-0 \
        libgl1 \
        libgomp1 \
        libjpeg62-turbo \
        libpng16-16 \
    && rm -rf /var/lib/apt/lists/*

COPY docker/marker/requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

COPY docker/marker/server.py /app/server.py
COPY docker/marker/markerParser.py /app/markerParser.py
COPY docker/marker/parsing_profiles.py /app/parsing_profiles.py
COPY docker/marker/parser_settings.py /app/parser_settings.py

EXPOSE 8002

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8002"]
