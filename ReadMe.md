# API
This folder contains the content of your API definition.
Name: Conference Management - Revised
URL Fragment: conf-management
Comments: Illustrates message handling (works with Conference Offers) - async, queued with mult req events, timers.
Accepts Approved Conference Offers; Enable Manage > Listeners > Connections; see Rules > Process Messages topic.

Revision to shipped sample - ** see wiki ** (above) for Installation Instructions.

Note: uses public broker, not allowed in some corporate networks).

On a Mac, you may wish to test locally; start MQTT like this:
/usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf

and consider MQTTBox for monitoring messages.
