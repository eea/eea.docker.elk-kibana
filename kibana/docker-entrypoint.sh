#!/bin/bash
set -e

# Add kibana as command if needed
if [[ "$1" == -* ]]; then
	set -- kibana "$@"
fi

echo "elasticsearch.url: 'http://elasticsearch:9200'" >> /kibana/config/kibana.yml
echo "server.host: '0.0.0.0'" >> /kibana/config/kibana.yml

if [ "$KIBANA_RW_USERNAME" = "YES" ]           
then
  echo "elasticsearch.username: \"KIBANA_RW_USERNAME\"" >> /kibana/config/kibana.yml
  echo "elasticsearch.password: \"KIBANA_RW_PASSWORD\"" >> /kibana/config/kibana.yml
fi

if [ $ENABLE_SSL = "YES" ]
then
  mkdir -p /var/ssl
  rm -f /var/ssl/*
  echo "creating ssl certificates"
  echo "$SSL_CERT" > /var/ssl/server.crt
  echo "$SSL_KEY" > /var/ssl/server.key

  chmod 400 /var/ssl/*

  echo "server.ssl.enabled: true" >> /kibana/config/kibana.yml
  echo "server.ssl.key: /var/ssl/server.key" >> /kibana/config/kibana.yml
  echo "server.ssl.certificate: /var/ssl/server.crt" >> /kibana/config/kibana.yml

  sed "s#KIBANA_RW_USERNAME#$KIBANA_RW_USERNAME#g" -i /kibana/config/kibana.yml
  sed "s#KIBANA_RW_PASSWORD#$KIBANA_RW_PASSWORD#g" -i /kibana/config/kibana.yml
fi

# Run as user "kibana" if the command is "kibana"
if [ "$1" = 'kibana' ]; then
	#if [ "$ELASTICSEARCH_URL" ]; then
	#	sed -ri "s!^(\#\s*)?(elasticsearch\.url:).*!\2 '$ELASTICSEARCH_URL'!" /kibana/config/kibana.yml
	#fi
	
	set -- gosu kibana tini -- "$@"
fi

exec "$@"
