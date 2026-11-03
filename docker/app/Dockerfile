FROM rocm/pytorch:rocm10.1.0_ubuntu26.04_py3.14_pytorch_release_2.14.0

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        nodejs \
        npm \
        libreoffice-core \
        libreoffice-writer && \
    rm -rf /var/lib/apt/lists/*

COPY ["requirements.txt", "./requirements.txt"]

RUN python3 -m pip install \
    --root-user-action=ignore \
    --no-cache-dir \
    -r requirements.txt

COPY ["src/Functions", "./Functions"]
COPY ["src/Web", "./Web"]
COPY ["src/glorpCat.py", "./glorpCat.py"]
