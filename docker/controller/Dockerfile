FROM docker:27-cli
RUN apk add --no-cache python3
WORKDIR /controller
COPY docker/controller/controller.py /controller/controller.py
CMD ["python3", "-u", "/controller/controller.py"]
