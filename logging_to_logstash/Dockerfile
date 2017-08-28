FROM sebp/elk:551

# Add my custom logstash config
ADD 99-brandon-input.conf /etc/logstash/conf.d/99-brandon-input.conf
ADD 30-output.conf /etc/logstash/conf.d/30-output.conf
