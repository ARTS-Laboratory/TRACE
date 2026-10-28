FROM rocm/pytorch:rocm10.1.0_ubuntu26.04_py3.14_pytorch_release_2.14.0

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        nodejs \
        npm && \
    rm -rf /var/lib/apt/lists/*

COPY ["requirements.txt", "./requirements.txt"]

RUN python3 -m pip install \
    --root-user-action=ignore \
    --no-cache-dir \
    -r requirements.txt

COPY ["system_development/Functions", "./Functions"]
COPY ["system_development/Web", "./Web"]
COPY ["system_development/glorpCat.py", "./glorpCat.py"]