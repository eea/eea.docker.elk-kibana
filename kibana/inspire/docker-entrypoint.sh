#!/bin/bash
set -e


export ELASTICSEARCH_HOSTS=${ELASTICSEARCH_HOSTS:-$ELASTICSEARCH_URL}
export ELASTICSEARCH_HOSTS=${ELASTICSEARCH_HOSTS:-'http://elastic:9200'}
export ELASTICSEARCH_USERNAME="${ELASTICSEARCH_USERNAME:-$KIBANA_RW_USERNAME}"
export ELASTICSEARCH_USERNAME=${ELASTICSEARCH_USERNAME:-'kibana_system'}
export ELASTICSEARCH_PASSWORD="${ELASTICSEARCH_PASSWORD:-$KIBANA_RW_PASSWORD}"

export ELASTICSEARCH_SSL_VERIFICATIONMONDE=${ELASTICSEARCH_SSL_VERIFICATIONMONDE:-none}

if [ -n "$KIBANA_AUTOCOMPLETETIMEOUT" ]; then
  if [ $(grep kibana.autocompleteTimeout config/kibana.yml | wc -l) -eq 0 ]; then
       echo "" >> config/kibana.yml
       echo "kibana.autocompleteTimeout: $KIBANA_AUTOCOMPLETETIMEOUT" >> config/kibana.yml
  else
       sed -i "s/kibana.autocompleteTimeout: .*/kibana.autocompleteTimeout: $KIBANA_AUTOCOMPLETETIMEOUT/" config/kibana.yml
  fi
fi

if [ -n "$KIBANA_AUTOCOMPLETETERMINATEAFTER" ]; then
  if [ $(grep kibana.autocompleteTerminateAfter config/kibana.yml | wc -l) -eq 0 ]; then      
       echo "" >> config/kibana.yml
       echo "kibana.autocompleteTerminateAfter: $KIBANA_AUTOCOMPLETETERMINATEAFTER" >> config/kibana.yml
  else
       sed -i "s/kibana.autocompleteTerminateAfter: .*/kibana.autocompleteTerminateAfter: $KIBANA_AUTOCOMPLETETERMINATEAFTER/" config/kibana.yml
  fi
fi


if [[ "$ENABLE_SSL" == "YES" ]] || [[ "$SERVER_SSL_ENABLED" == "true" ]]
then
  export SERVER_SSL_ENABLED='true'
  export SERVER_SSL_KEY=${SERVER_SSL_KEY:-'/var/ssl/server.key'}
  export SERVER_SSL_CERTIFICATE=${SERVER_SSL_CERTIFICATE:-'/var/ssl/server.crt'}
  
  mkdir -p /var/ssl
  rm -f /var/ssl/*
  echo "creating ssl certificates"

  cat /ssl/server.crt > /var/ssl/server.crt  
  cat /ssl/server.key > /var/ssl/server.key

  if [ -f /ssl/server-chain.crt ]; then
    cat /ssl/server-chain.crt > /var/ssl/server-chain.crt
    export SERVER_SSL_CERTIFICATE_AUTHORITIES=${SERVER_SSL_CERTIFICATE_AUTHORITIES:-'/var/ssl/server-chain.crt'}
  fi

  chmod 400 /var/ssl/*

fi

file=/usr/share/kibana/src/core/server/rendering/views/template.js

sed "s#Loading Elastic#Inspire Dashboard#g" -i $file

sed 's#"Elastic"#"Inspire"#g' -i $file


file=/usr/share/kibana/src/core/server/rendering/views/logo.js

const_logo=$(sed -n '/const Logo/=' $file)
tail -n +$const_logo $file > template_tail_tmp

const_logo=$(($const_logo-1))
head -n +$const_logo $file > template_head

comma=$(sed -n '/;/=' template_tail_tmp | head -n 1)
comma=$(($comma+1))
tail -n +$comma template_tail_tmp > template_tail

cat template_head > $file
echo "const Logo = () => /*#__PURE__*/_react.default.createElement(\"img\", {src:'https://raw.githubusercontent.com/eea/eea.docker.elk-kibana/7.15.1/kibana/inspire/src/app.ico',width:'80px'});" >> $file
cat template_tail >> $file

#password enabled and anonimous access enabled
if [[ "${ALLOW_ANON_RO}" == "true" ]] && [ ! -f /tmp/users_created ] && [ -n "$elastic_password" ]; then

  #setting variables used in configuration, using default values
  anon_password=$(date +%s | sha256sum | base64 | head -c 12)
  ANON_PASSWORD="${ANON_PASSWORD:-$anon_password}"
  read_only_role_json='{"elasticsearch":{"cluster":[],"indices":[{"names":["*"],"privileges":["read"],"allow_restricted_indices":false}],"run_as":[]},"kibana":[{"base":[],"feature":{"dashboard":["read"]},"spaces":["*"]}]}'
  READ_ONLY_ROLE_JSON="${READ_ONLY_ROLE_JSON:-$read_only_role_json}"
  
  echo "Adding anonimous access to kibana.yml"
  
  if [ $(grep xpack.security.authc.providers config/kibana.yml | wc -l) -ne 0 ]; then
  
  line=$(grep -n xpack.security.authc.providers config/kibana.yml | awk -F: '{print $1}')
  end_line=$(( $line + 11 ))
  sed -i "${line},${end_line}d" config/kibana.yml
  
  fi
  
  echo "
xpack.security.authc.providers:
  basic.basic1:
    order: 0
    description: \"Log in to have edit rights\"
  anonymous.anonymous1:
    order: 1
    description: \"Continue as guest\"
    icon: \"globe\"
    credentials: 
      username: \"anonymous_service_account\"
      password: \"${ANON_PASSWORD}\"
" >> config/kibana.yml


  #wait for elasticsearch user/password to be ok
  while [ $( curl -I -s  -uelastic:$elastic_password  $ELASTICSEARCH_HOSTS  | grep -c 200 )  -eq 0 ]; do sleep 10; done
  echo "Elasticsearch is up, superuser elastic password is working"
  
  #start kibana
  "$@" &
  
  #wait for the kibana user interface to be up
  while [ $( curl -I -s  -uelastic:$elastic_password  localhost:5601/internal/security/users/elastic | grep -c 200 )  -eq 0 ]; do sleep 10; done

  
  if  [ $( curl -I -s -uelastic:$elastic_password  localhost:5601/api/security/role/read_only | grep -ic "200 OK" ) -eq 0 ]; then
     echo "Setting default read_only role"
     curl  -uelastic:$elastic_password -X PUT -H 'Content-Type: application/json' -H "kbn-xsrf: reporting" localhost:5601/api/security/role/read_only -d"$READ_ONLY_ROLE_JSON"
  fi

  echo "Setting default anonymous_service_account user"
  curl  -uelastic:$elastic_password -X POST -H 'Content-Type: application/json'   -H "kbn-xsrf: reporting" localhost:5601/internal/security/users/anonymous_service_account -d"{\"password\":\"$ANON_PASSWORD\",\"username\":\"anonymous_service_account\",\"full_name\":\"\",\"email\":\"\",\"roles\":[\"read_only\"]}"
  touch /tmp/users_created 

  wait 

else

  exec "$@"

fi
