#!/bin/bash
set -e

# Add kibana as command if needed
if [[ "$1" == -* ]]; then
	set -- kibana "$@"
fi

cp /opt/kibana.yml /opt/kibana/config/kibana.yml


ELASTICSEARCH_URL=${ELASTICSEARCH_URL:-'https://elasticsearch:9200'}
SERVER_HOST=${SERVER_HOST:-'0.0.0.0'}


echo "elasticsearch.url: '$ELASTICSEARCH_URL'" >> /opt/kibana/config/kibana.yml
echo "server.host: '$SERVER_HOST'" >> /opt/kibana/config/kibana.yml

if [ -n "$KIBANA_RW_USERNAME" ]           
then
  echo "elasticsearch.username: \"KIBANA_RW_USERNAME\"" >> /opt/kibana/config/kibana.yml
  echo "elasticsearch.password: \"KIBANA_RW_PASSWORD\"" >> /opt/kibana/config/kibana.yml

  sed "s#KIBANA_RW_USERNAME#$KIBANA_RW_USERNAME#g" -i /opt/kibana/config/kibana.yml
  sed "s#KIBANA_RW_PASSWORD#$KIBANA_RW_PASSWORD#g" -i /opt/kibana/config/kibana.yml
fi

#self signed certificate in elasticsearch
echo "elasticsearch.ssl.verificationMode: none" >> /opt/kibana/config/kibana.yml

if [[ "$ENABLE_SSL" == "YES" ]]
then
  mkdir -p /var/ssl
  rm -f /var/ssl/*
  echo "creating ssl certificates"

  cat /ssl/server.crt > /var/ssl/server.crt  
  cat /ssl/server.key > /var/ssl/server.key

  echo "server.ssl.enabled: true" >> /opt/kibana/config/kibana.yml
  echo "server.ssl.key: /var/ssl/server.key" >> /opt/kibana/config/kibana.yml
  echo "server.ssl.certificate: /var/ssl/server.crt" >> /opt/kibana/config/kibana.yml

  if [ -f /ssl/server-chain.crt ]; then
    cat /ssl/server-chain.crt > /var/ssl/server-chain.crt
    echo 'server.ssl.certificate_authorities: "/var/ssl/server-chain.crt"' >> /opt/kibana/config/kibana.yml
  fi

  chmod 400 /var/ssl/*

fi

# Run as user "kibana" if the command is "kibana"
if [ "$1" = 'kibana' ]; then
	#if [ "$ELASTICSEARCH_URL" ]; then
	#	sed -ri "s!^(\#\s*)?(elasticsearch\.url:).*!\2 '$ELASTICSEARCH_URL'!" /opt/kibana/config/kibana.yml
	#fi
	
	set -- gosu kibana tini -- "$@"
fi

exec "$@"
