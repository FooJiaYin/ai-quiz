# can change depending on the project
FROM node:16.20.0

# install any necessary linux packages
RUN apt-get update -y
RUN apt install -y \
  apt-utils \
  wget \
  git

# set environment variables (depend on the framework used)
ENV OPENAI_API_KEY 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
ENV OPENAI_ORG_ID org-hQzwgSyg8CpRa2eamQBZQtsn

# Copy and install source, everything inside the src folder will be copied to the base directory of the docker image
COPY ./ /opt/demo/
WORKDIR /opt/demo/

# install any dependencies
# example:
# RUN pip3 install streamlit==1.25.0
# or if you have a requirements.txt file:
# RUN pip3 install -r requirements.txt

# expose relevant port (depend on the framework used)
EXPOSE 3000

# start app (depend on the framework used, should be the same command used to start the server locally)
# for example, for command `streamlit run run.py`
CMD [ "node", "./server/index.mjs" ]