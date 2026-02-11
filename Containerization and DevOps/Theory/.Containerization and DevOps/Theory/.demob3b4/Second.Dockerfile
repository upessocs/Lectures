FROM ubuntu:22.04
RUN apt update 
RUN apt install -y openjdk-17-jdk
RUN apt install -y python3 python3-pip 
WORKDIR /home/app
COPY Hello.java .
RUN javac Hello.java

ENTRYPOINT [ "echo", "Prateek"]
CMD ["java", "Hello"]
